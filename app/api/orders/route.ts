import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { name, phone, address, items } = body;

    // Normalisasi email: string kosong ("") → null agar tersimpan sebagai NULL di DB
    // Kolom guestEmail di schema.prisma bertipe String? (nullable), sehingga ini aman.
    const email: string | null = body.email?.trim() || null;

    // 1. Validasi Input Dasar. Email wajib diisi di form checkout (frontend), tapi backend
    // tetap tidak mewajibkannya di sini karena guestEmail di DB bertipe String? (nullable).
    if (!name || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'Nama, nomor telepon, alamat, dan minimal 1 produk wajib diisi' }, { status: 400 });
    }

    // 2. Gabungkan quantity per productId untuk mencegah bypass stok lewat duplikat id
    const quantityMap = new Map<string, number>();
    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json({ message: 'Payload item tidak valid' }, { status: 400 });
      }
      quantityMap.set(item.productId, (quantityMap.get(item.productId) || 0) + item.quantity);
    }

    const productIds = Array.from(quantityMap.keys());

    // 3. Ambil data produk real dari Database (Security: JANGAN trust price dari frontend)
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({ message: 'Beberapa produk tidak ditemukan atau tidak valid' }, { status: 400 });
    }

    // 4. Persiapkan perhitungan dan validasi stok per item
    let calculatedTotalAmount = 0;
    const orderItemsData: any[] = [];
    const stockErrors: string[] = [];

    for (const [productId, quantity] of quantityMap.entries()) {
      const dbProduct = dbProducts.find(p => p.id === productId);
      if (!dbProduct) continue;

      // VALIDASI STOK (Server-side): Pastikan stok di database masih cukup saat PENDING
      // CATATAN PENTING: Kita HANYA memvalidasi stok di sini. Kita TIDAK mengurangi stok produk.
      // Sesuai BUSINESS_RULES.md, stok baru dikurangi saat status order menjadi PAID (lewat webhook Midtrans).
      if (dbProduct.stock < quantity) {
        stockErrors.push(`Stok untuk produk "${dbProduct.name}" tidak mencukupi (Tersisa: ${dbProduct.stock})`);
      }

      // Hitung subtotal. Pakai harga yang ditarik dari DB.
      const priceAtPurchase = Number(dbProduct.price);
      calculatedTotalAmount += priceAtPurchase * quantity;

      // Siapkan object mapping untuk Prisma create
      orderItemsData.push({
        productId: dbProduct.id,
        quantity: quantity,
        priceAtPurchase: priceAtPurchase, // Snapshot harga
      });
    }

    // Jika ada validasi stok yang gagal, tolak pesanan seluruhnya
    if (stockErrors.length > 0) {
      return NextResponse.json({ message: stockErrors.join(', ') }, { status: 400 });
    }

    // 5. Generate midtransOrderId yang unique (rawan collision kalau cuma timestamp)
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14); // e.g. 20260727123045
    const uniqueMidtransId = `ORD-${timestamp}-${uuidv4().split('-')[0]}`;

    // 6. Buat Order & OrderItem dalam 1 transaction
    const newOrder = await prisma.order.create({
      data: {
        userId: session?.user?.id || null, // hubungkan jika login
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        shippingAddress: address,
        status: 'PENDING',
        totalAmount: calculatedTotalAmount, // Terhitung 100% dari Backend
        shippingCost: 0, // V1: Gratis ongkir
        midtransOrderId: uniqueMidtransId, 
        items: {
          create: orderItemsData,
        }
      },
      include: {
        items: true,
      }
    });

    return NextResponse.json({ 
      message: 'Order berhasil dibuat', 
      orderId: newOrder.id,
      midtransOrderId: newOrder.midtransOrderId,
      totalAmount: Number(newOrder.totalAmount)
    }, { status: 201 });

  } catch (error) {
    console.error('API Orders Create Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

import { prisma } from '@/lib/prisma';

// Status order yang masih boleh dibuatkan Snap token (belum lunas/kadaluarsa)
const PAYABLE_STATUSES = ['PENDING', 'MENUNGGU_BAYAR'];

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ message: 'orderId wajib diisi' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ message: 'Order tidak ditemukan' }, { status: 404 });
    }

    if (!PAYABLE_STATUSES.includes(order.status)) {
      return NextResponse.json({ message: 'Order ini sudah tidak bisa dibayar' }, { status: 400 });
    }

    // item_details wajib totalnya sama persis dengan gross_amount, jadi gross_amount
    // dihitung ulang dari item_details (bukan langsung dari order.totalAmount)
    const itemDetails = order.items.map((item) => ({
      id: item.productId,
      price: Math.round(Number(item.priceAtPurchase)),
      quantity: item.quantity,
      name: item.product.name.slice(0, 50),
    }));

    const shippingCost = Math.round(Number(order.shippingCost));
    if (shippingCost > 0) {
      itemDetails.push({ id: 'SHIPPING', price: shippingCost, quantity: 1, name: 'Biaya Pengiriman' });
    }

    const grossAmount = itemDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: order.midtransOrderId,
        gross_amount: grossAmount,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: order.guestName || 'Pelanggan',
        email: order.guestEmail || undefined,
        phone: order.guestPhone || undefined,
      },
    });

    return NextResponse.json({ token: transaction.token, redirectUrl: transaction.redirect_url });
  } catch (error) {
    console.error('API Checkout (Midtrans Snap) Error:', error);
    return NextResponse.json({ message: 'Gagal membuat transaksi pembayaran' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['MENUNGGU_ONGKIR', 'CANCELLED', 'EXPIRED'],
  MENUNGGU_ONGKIR: ['MENUNGGU_BAYAR', 'CANCELLED'],
  MENUNGGU_BAYAR: ['PAID', 'CANCELLED', 'EXPIRED'],
  PAID: ['PROCESSING', 'SHIPPED'],
  PROCESSING: ['SHIPPED'],
  SHIPPED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
  EXPIRED: [],
};

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { status, shippingCost } = await req.json();
    if (!Object.keys(VALID_TRANSITIONS).includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true }
    });

    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    // MENUNGGU_BAYAR -> MENUNGGU_BAYAR is allowed to update shipping cost
    if (order.status !== status && !VALID_TRANSITIONS[order.status].includes(status)) {
      return NextResponse.json({ message: `Cannot transition from ${order.status} to ${status}` }, { status: 400 });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Validasi Stok Atomik HANYA saat status dipastikan bergeser masuk ke flow berbayar
      if (status === 'PAID') {
        for (const item of order.items) {
          const result = await tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } }
          });
          if (result.count === 0) {
            throw new Error(`Stok kurang untuk memvalidasi pesanan ini. Update gagal.`);
          }
        }
      }

      const updateData: any = { status };

      if (shippingCost !== undefined && (order.status === 'MENUNGGU_ONGKIR' || order.status === 'MENUNGGU_BAYAR')) {
        updateData.shippingCost = Number(shippingCost);
        // Sesuai kesepakatan: totalAmount = subtotal + ongkir saat MENUNGGU_BAYAR
        // (totalAmount saat checkout menyimpan subtotal murni)
        const subtotal = order.items.reduce((sum, item) => sum + (Number(item.priceAtPurchase) * item.quantity), 0);
        updateData.totalAmount = subtotal + Number(shippingCost);
      }

      // Gunakan CAS (updateMany) untuk mencegah race condition jika request paralel
      const res = await tx.order.updateMany({
        where: { id: params.id, status: order.status },
        data: updateData
      });

      if (res.count === 0) {
        throw new Error('Status pesanan sudah berubah, silakan muat ulang.');
      }

      return tx.order.findUnique({ where: { id: params.id } });
    });

    return NextResponse.json(updatedOrder);

  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error updating order' }, { status: 400 });
  }
}

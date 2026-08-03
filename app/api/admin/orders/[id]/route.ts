import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
  try {
    const { status } = await req.json();
    const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'EXPIRED'];
    if (!validStatuses.includes(status)) return NextResponse.json({ message: 'Invalid status' }, { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true }
    });

    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Validasi Stok Atomik HANYA saat transisi PENDING -> PAID
      if (status === 'PAID' && order.status === 'PENDING') {
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

      // Pembatalan HANYA diizinkan dari status PENDING (Sesuai BUSINESS_RULES.md)
      if ((status === 'CANCELLED' || status === 'EXPIRED') && order.status !== 'PENDING') {
        throw new Error('Pesanan hanya dapat dibatalkan jika status masih PENDING.');
      }

      return tx.order.update({
        where: { id: params.id },
        data: { status }
      });
    });

    return NextResponse.json(updatedOrder);

  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error updating order' }, { status: 400 });
  }
}

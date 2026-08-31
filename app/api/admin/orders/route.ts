import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  // ?stats=1 -> hitungan asli seluruh tabel, bukan hanya 50 baris di bawah.
  // Dipakai untuk membuktikan tidak ada baris hilang sebelum/sesudah migrasi.
  if (new URL(req.url).searchParams.get('stats') === '1') {
    const [byStatus, total] = await Promise.all([
      prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.order.count(),
    ]);
    return NextResponse.json({
      total,
      byStatus: byStatus.map((g) => ({ status: g.status, count: g._count._all })),
    });
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        items: { include: { product: true } }
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}

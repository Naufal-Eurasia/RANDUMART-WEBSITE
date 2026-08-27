import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  const mapped = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    emoji: c.emoji || '🛍️',
    productCount: c._count.products,
  }));

  return NextResponse.json(mapped);
}

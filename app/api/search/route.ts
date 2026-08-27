import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mapPrismaProducts } from '@/lib/product-mapper';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const trending = searchParams.get('trending') === 'true';

    if (trending) {
      const products = await prisma.product.findMany({
        where: { isPublished: true, isBestSeller: true },
        take: 4,
        include: { images: true, category: true },
        orderBy: { reviewCount: 'desc' }
      });
      return NextResponse.json(mapPrismaProducts(products));
    }

    if (!q) return NextResponse.json([]);

    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { category: { name: { contains: q, mode: 'insensitive' } } }
        ]
      },
      take: 6,
      include: { images: true, category: true }
    });

    return NextResponse.json(mapPrismaProducts(products));
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

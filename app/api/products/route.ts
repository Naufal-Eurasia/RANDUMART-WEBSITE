import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const sort = searchParams.get('sort');

    const where: any = {
      isPublished: true,
    };

    if (categorySlug && categorySlug !== 'all') {
      where.category = {
        slug: categorySlug
      };
    }

    let orderBy: any = undefined;
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'discount':
        orderBy = { discount: 'desc' };
        break;
      default:
        orderBy = { reviewCount: 'desc' };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: true,
        category: true,
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('API Products Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

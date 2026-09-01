import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mapPrismaProducts } from '@/lib/product-mapper';
import { getProductSalesMap, sortByPopularity } from '@/lib/product-popularity';

export const revalidate = 15;

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

    // "Most Popular" tidak bisa lewat orderBy Prisma biasa: peringkatnya berasal
    // dari agregasi quantity OrderItem (order PAID/COMPLETED), bukan kolom Product
    // itu sendiri — jadi diambil & diurutkan manual di luar switch orderBy di bawah.
    if (sort === 'popular' || sort === 'most-popular') {
      const [products, salesMap] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            images: true,
            category: true,
          },
        }),
        getProductSalesMap(),
      ]);

      return NextResponse.json(mapPrismaProducts(sortByPopularity(products, salesMap)));
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
        // Dibutuhkan mapper untuk menghitung soldCount. Hanya status &
        // quantity yang ditarik — bukan seluruh baris pesanan.
        orderItems: { select: { quantity: true, order: { select: { status: true } } } },
      }
    });

    // Lewat mapper, bukan baris Prisma mentah: mapper yang memasang
    // transformasi Cloudinary dan menormalkan Decimal jadi number.
    // Endpoint ini dulu satu-satunya yang melewatinya, jadi klien
    // terpaksa memetakan ulang sendiri.
    return NextResponse.json(mapPrismaProducts(products));
  } catch (error) {
    console.error('API Products Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

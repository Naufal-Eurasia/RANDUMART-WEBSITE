import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function GET() {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: true,
        _count: {
          select: { orderItems: true }
        }
      }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('API GET Products Error:', error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
  try {
    const body = await req.json();
    const {
      name, slug, description, price, originalPrice, discount, 
      stock, categoryId, isBestSeller, isNew, tags, isPublished,
      rating, reviewCount, imageUrls
    } = body;

    if (!name || !slug || !description || price === undefined || stock === undefined || !categoryId) {
      return NextResponse.json({ message: 'Field mandatory harus diisi' }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ message: 'Slug sudah dipakai' }, { status: 400 });

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        discount: discount ? Number(discount) : null,
        stock: Number(stock),
        categoryId,
        isBestSeller: Boolean(isBestSeller),
        isNew: Boolean(isNew),
        tags: Array.isArray(tags) ? tags : [],
        isPublished: isPublished ?? true,
        images: { create: (imageUrls || []).map((url: string, idx: number) => ({ url, isPrimary: idx === 0 })) },
        rating: rating !== undefined ? Number(rating) : 0,
        reviewCount: reviewCount !== undefined ? Number(reviewCount) : 0,
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('API POST Product Error:', error);
    return NextResponse.json({ message: 'Error creating product' }, { status: 500 });
  }
}

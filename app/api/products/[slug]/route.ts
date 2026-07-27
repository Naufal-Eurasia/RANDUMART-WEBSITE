import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        images: true,
        category: true,
      }
    });

    if (!product || !product.isPublished) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('API Product Detail Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

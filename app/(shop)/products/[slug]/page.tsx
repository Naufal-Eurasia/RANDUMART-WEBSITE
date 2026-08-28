import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { countSold } from '@/lib/product-mapper';
import ProductDetailClient from './client-page';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: true,
      category: true,
      orderItems: { select: { quantity: true, order: { select: { status: true } } } },
    }
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  const p = {
    ...product,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    imageGallery: product.images.map(img => img.url),
    tags: product.tags || [],
    // Halaman ini memetakan sendiri, bukan lewat mapPrismaProduct, jadi
    // bpomNo/halalMui tidak pernah sampai ke UI yang membaca bpom/halal.
    bpom: product.bpomNo ?? '',
    halal: !!product.halalMui,
    soldCount: countSold(product.orderItems),
  };

  const relatedDb = await prisma.product.findMany({
    where: { 
      categoryId: product.categoryId, 
      id: { not: product.id },
      isPublished: true
    },
    include: { images: true, category: true },
    take: 4
  });

  const related = relatedDb.map(r => ({
    ...r,
    price: Number(r.price),
    originalPrice: r.originalPrice ? Number(r.originalPrice) : null,
    categorySlug: r.category.slug,
    categoryName: r.category.name,
    image: r.images?.find(i => i.isPrimary)?.url || r.images?.[0]?.url || '',
    shortDescription: r.description
  }));

  return <ProductDetailClient product={p} related={related} />;
}

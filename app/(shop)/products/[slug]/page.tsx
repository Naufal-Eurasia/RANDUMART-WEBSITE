import { notFound } from 'next/navigation';
import { getCachedProductBySlug, getCachedProductsList } from '@/lib/product-queries';
import ProductDetailClient from './client-page';

export const revalidate = 3600;

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getCachedProductBySlug(params.slug);

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
  };

  const relatedDb = await getCachedProductsList(
    { categoryId: product.categoryId, id: { not: product.id }, isPublished: true },
    undefined,
    4
  );

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

import type { Product, Badge } from './types';

function deriveBadges(p: any): Badge[] {
  const b: Badge[] = [];
  if (p.isBestSeller) b.push('best-seller');
  if (p.isNew) b.push('new-arrival');
  if (p.stock === 0) b.push('out-of-stock');
  return b;
}

export function mapPrismaProduct(p: any): Product {
  const primary = p.images?.find((i: any) => i.isPrimary);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category?.name ?? '',
    categorySlug: p.category?.slug ?? '',
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    discount: p.discount ?? undefined,
    image: primary?.url ?? p.images?.[0]?.url ?? '/placeholder.jpg',
    images: (p.images ?? []).map((i: any) => ({ url: i.url })),
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    description: p.description ?? '',
    shortDescription: (p.description ?? '').slice(0, 120),
    benefits: [],        // ponytail: add benefits column when product detail uses DB
    ingredients: '',     // ponytail: add to schema when needed
    usage: '',
    bpom: '',
    halal: false,
    stock: p.stock ?? 0,
    tags: p.tags ?? [],
    badges: deriveBadges(p),
    reviews: [],         // ponytail: add Review model when reviews come from DB
    bestSeller: p.isBestSeller ?? false,
    isNew: p.isNew ?? false,
    limited: false,
  };
}

export function mapPrismaProducts(products: any[]): Product[] {
  return products.map(mapPrismaProduct);
}

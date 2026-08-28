import type { Product, Badge } from './types';
import { cdn, IMG_CARD, IMG_GALLERY } from './cloudinary';

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
    // Semua URL gambar lewat cdn() di sini — ini satu-satunya pintu keluar
    // produk ke klien, jadi tidak ada jalur yang lolos mengirim foto mentah.
    image: cdn(primary?.url ?? p.images?.[0]?.url, IMG_CARD) ?? '/placeholder.jpg',
    images: (p.images ?? []).map((i: any) => ({ url: cdn(i.url, IMG_GALLERY) ?? '' })),
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    description: p.description ?? '',
    shortDescription: (p.description ?? '').slice(0, 120),
    benefits: [],        // ponytail: add benefits column when product detail uses DB
    ingredients: '',     // ponytail: add to schema when needed
    usage: '',
    bpom: p.bpomNo ?? '',
    halal: !!p.halalMui,
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

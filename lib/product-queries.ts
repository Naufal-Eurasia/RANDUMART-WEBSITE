import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

const PRODUCT_INCLUDE = { images: true, category: true } as const;

// Dipakai homepage, halaman detail produk, dan /api/products — semua ditag
// 'produk' supaya revalidateTag('produk') di API mutasi admin benar-benar
// menghapus cache ini, bukan cuma menunggu revalidate berbasis waktu habis.
export const getCachedProductsList = unstable_cache(
  async (where: any, orderBy?: any, take?: number) =>
    prisma.product.findMany({ where, orderBy, take, include: PRODUCT_INCLUDE }),
  ['products-list'],
  { tags: ['produk'], revalidate: 3600 }
);

export const getCachedProductBySlug = unstable_cache(
  async (slug: string) =>
    prisma.product.findUnique({ where: { slug }, include: PRODUCT_INCLUDE }),
  ['product-by-slug'],
  { tags: ['produk'], revalidate: 3600 }
);

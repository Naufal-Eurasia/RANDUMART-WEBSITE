import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

// Dipakai /api/bundles (publik) — ditag 'bundles' supaya revalidateTag('bundles')
// di API admin (create/update/delete) langsung menghapus cache ini, tidak perlu
// menunggu revalidate berbasis waktu habis.
export const getCachedBundles = unstable_cache(
  async () =>
    prisma.bundle.findMany({
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ['bundles-list'],
  { tags: ['bundles'], revalidate: 3600 }
);

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Foto produk asli rata-rata 600 KB; 13 kategori = 7,8 MB kalau dipakai mentah.
// Sisipkan transformasi Cloudinary supaya turun ke ~17 KB per gambar.
// next.config.js set images.unoptimized, jadi ini satu-satunya tuas resize.
// ponytail: hanya menangani host Cloudinary — host lain lewat apa adanya.
function thumbnail(url: string | undefined): string | null {
  if (!url) return null;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_400,h_533,c_fill,g_auto/');
}

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      // Hanya produk terbit yang dihitung — angka di navbar harus cocok
      // dengan yang benar-benar dilihat pembeli di halaman kategori.
      _count: { select: { products: { where: { isPublished: true } } } },
      // Satu foto produk asli sebagai wajah kategori. orderBy wajib: tanpa itu
      // Postgres bebas memilih baris, jadi foto kartu bisa berubah tiap request.
      products: {
        where: { isPublished: true },
        orderBy: { createdAt: 'asc' },
        take: 1,
        select: { images: { where: { isPrimary: true }, take: 1, select: { url: true } } },
      },
    },
  });

  const mapped = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    productCount: c._count.products,
    image: thumbnail(c.products[0]?.images[0]?.url),
  }));

  return NextResponse.json(mapped);
}

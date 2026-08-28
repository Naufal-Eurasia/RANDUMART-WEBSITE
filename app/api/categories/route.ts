import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cdn } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

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
    // Dengan tinggi: dipotong ke 3:4 karena kartu kategori object-cover.
    image: cdn(c.products[0]?.images[0]?.url, 400, 533),
  }));

  return NextResponse.json(mapped);
}

import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { cdn } from '@/lib/cloudinary';

export async function PromoBanner() {
  const now = new Date();
  const banners = await prisma.promoBanner.findMany({
    where: {
      isActive: true,
      // Tampilkan jika endDate belum diset (null) atau belum kadaluarsa
      OR: [{ endDate: null }, { endDate: { gte: now } }],
    },
    orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
  });

  if (banners.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      {banners.map((banner) => {
        const image = (
          <div className="relative w-full aspect-[16/5] min-h-[120px] rounded-3xl overflow-hidden bg-muted">
            {/* 1600px: banner selebar layar, dan yang position 0 dimuat
                priority — ini gambar pertama yang dilihat pembeli. */}
            <Image
              src={cdn(banner.imageUrl, 1600) ?? banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover"
              priority={banner.position === 0}
            />
          </div>
        );

        return banner.linkUrl ? (
          <Link key={banner.id} href={banner.linkUrl} className="block">
            {image}
          </Link>
        ) : (
          <div key={banner.id}>{image}</div>
        );
      })}
    </div>
  );
}

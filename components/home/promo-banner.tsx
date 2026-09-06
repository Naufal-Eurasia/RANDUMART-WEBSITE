import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { cdn } from '@/lib/cloudinary';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <div className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => {
          // Format date if exists
          const endDateStr = banner.endDate 
            ? new Date(banner.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : null;

          const isHero = banner.layout === 'hero';
          const wrapperClass = `group flex flex-col bg-white rounded-2xl border border-border/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden ${isHero ? 'md:col-span-2' : ''}`;

          const CardContent = (
            <>
              {/* Image Section */}
              <div className={`relative w-full bg-muted overflow-hidden ${isHero ? 'aspect-[2/1] md:aspect-[21/9]' : 'aspect-video'}`}>
                <Image
                  src={cdn(banner.imageUrl, isHero ? 1200 : 800) ?? banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority={banner.position === 0}
                />
                
                {/* Type Badge */}
                <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                  {banner.type === 'FLASH_SALE' && (
                    <Badge className="bg-red-600 hover:bg-red-700 text-white border-none shadow-md font-semibold px-3 py-1 text-xs">
                      🔥 Flash Sale
                    </Badge>
                  )}
                  {banner.type === 'DISCOUNT_PERCENT' && (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-md font-semibold px-3 py-1 text-xs">
                      <Tag className="w-3.5 h-3.5 mr-1.5" /> Diskon Spesial
                    </Badge>
                  )}
                  {banner.type === 'CUSTOM' && (
                    <Badge variant="secondary" className="bg-white/90 hover:bg-white text-brand-green border-none shadow-md font-semibold backdrop-blur-sm px-3 py-1 text-xs">
                      ✨ Promo
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-1 p-5 md:p-6 bg-brand-cream/10">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className={`font-display font-bold text-brand-green leading-tight line-clamp-2 ${isHero ? 'text-xl md:text-2xl' : 'text-lg'}`}>
                      {banner.title}
                    </h3>
                    {banner.discountValue && banner.type !== 'CUSTOM' && (
                      <div className="flex-shrink-0 bg-red-100 text-red-700 font-extrabold px-3 py-1.5 rounded-xl text-sm md:text-base whitespace-nowrap shadow-sm border border-red-200">
                        {banner.discountValue}% OFF
                      </div>
                    )}
                  </div>
                  
                  {banner.description && (
                    <p className={`text-muted-foreground line-clamp-2 mb-6 ${isHero ? 'text-base' : 'text-sm'}`}>
                      {banner.description}
                    </p>
                  )}
                </div>

                {/* Footer Section */}
                <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between gap-3">
                  <div className="flex items-center text-xs md:text-sm">
                    {endDateStr ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                        <span className="font-medium text-orange-700">Berakhir: {endDateStr}</span>
                      </>
                    ) : (
                      <span className="text-brand-green font-medium">Promo Aktif</span>
                    )}
                  </div>
                  
                  <div className="inline-flex items-center justify-center text-xs md:text-sm font-semibold text-brand-cream bg-brand-green group-hover:bg-brand-greenHover px-4 py-2 rounded-xl transition-colors shadow-sm">
                    Lihat Detail Promo
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </div>
                </div>
              </div>
            </>
          );

          const targetUrl = banner.linkUrl || `/promo/${banner.id}`;

          return (
            <Link key={banner.id} href={targetUrl} className={wrapperClass}>
              {CardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { mapPrismaProducts } from '@/lib/product-mapper';
import { ProductCard } from '@/components/product/product-card';
import { Clock, Tag, Calendar, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cdn } from '@/lib/cloudinary';

interface PromoDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PromoDetailPage({ params }: PromoDetailPageProps) {
  const promo = await prisma.promoBanner.findUnique({
    where: { id: params.id },
  });

  if (!promo) {
    notFound();
  }

  // Fetch products if there are any
  let products: any[] = [];
  if (promo.productIds && promo.productIds.length > 0) {
    const rawProducts = await prisma.product.findMany({
      where: {
        id: { in: promo.productIds },
        isPublished: true,
      },
      include: {
        category: true,
        images: true,
      },
    });
    products = mapPrismaProducts(rawProducts);
  }

  const startDateStr = promo.startDate
    ? new Date(promo.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
    
  const endDateStr = promo.endDate
    ? new Date(promo.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      {/* Promo Header */}
      <div className="bg-white rounded-3xl border border-border/60 shadow-soft overflow-hidden mb-12">
        <div className="relative w-full aspect-[21/9] bg-muted">
          <Image
            src={cdn(promo.imageUrl, 1200) ?? promo.imageUrl}
            alt={promo.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="p-6 md:p-10 bg-brand-cream/10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {promo.type === 'FLASH_SALE' && (
              <Badge className="bg-red-600 hover:bg-red-700 text-white border-none shadow-sm px-3 py-1.5 text-sm font-semibold">
                🔥 Flash Sale
              </Badge>
            )}
            {promo.type === 'DISCOUNT_PERCENT' && (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm px-3 py-1.5 text-sm font-semibold">
                <Tag className="w-4 h-4 mr-1.5" /> Diskon Spesial
              </Badge>
            )}
            {promo.type === 'CUSTOM' && (
              <Badge className="bg-brand-green hover:bg-brand-greenHover text-white border-none shadow-sm px-3 py-1.5 text-sm font-semibold">
                ✨ Promo
              </Badge>
            )}
            
            {promo.discountValue && (
              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 font-bold px-3 py-1.5 text-sm">
                Potongan {promo.discountValue}%
              </Badge>
            )}
          </div>

          <h1 className="font-display font-bold text-3xl md:text-4xl text-brand-green mb-4">
            {promo.title}
          </h1>

          {promo.description && (
            <p className="text-muted-foreground text-lg mb-6 max-w-3xl leading-relaxed">
              {promo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/50 text-sm md:text-base font-medium">
            {startDateStr && (
              <div className="flex items-center text-brand-green">
                <Calendar className="w-5 h-5 mr-2 opacity-80" />
                Mulai: {startDateStr}
              </div>
            )}
            {endDateStr && (
              <div className="flex items-center text-orange-600">
                <Clock className="w-5 h-5 mr-2 opacity-80" />
                Berakhir: {endDateStr}
              </div>
            )}
            {!startDateStr && !endDateStr && (
              <div className="flex items-center text-brand-green">
                <Calendar className="w-5 h-5 mr-2 opacity-80" />
                Promo Aktif
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      {products.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-brand-green flex items-center">
              <Package className="w-7 h-7 mr-3 text-emerald-500" />
              Produk Promo
            </h2>
            <div className="text-sm font-medium text-brand-green bg-brand-cream/30 px-4 py-2 rounded-full border border-brand-green/20 shadow-sm">
              {products.length} Produk
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-border/60 p-12 text-center shadow-soft">
          <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-display font-semibold text-xl text-brand-green mb-2">Belum ada produk</h3>
          <p className="text-muted-foreground">Promo ini belum memiliki daftar produk yang ditentukan.</p>
        </div>
      )}
    </div>
  );
}

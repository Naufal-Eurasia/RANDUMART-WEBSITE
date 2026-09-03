import { Suspense } from 'react';
import { getCachedProductsList } from '@/lib/product-queries';
import { mapPrismaProducts } from '@/lib/product-mapper';
import { getProductSalesMap, sortByPopularity } from '@/lib/product-popularity';
import { Skeleton } from '@/components/ui/skeleton';
import { Hero } from '@/components/home/hero';
import { PromoBanner } from '@/components/home/promo-banner';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { FeaturedProducts } from '@/components/home/featured-products';
import { ProductCatalog } from '@/components/home/product-catalog';
import { PromoSection } from '@/components/home/promo-section';
import { BrandAmbassador } from '@/components/home/brand-ambassador';
import { WhyChoose } from '@/components/home/why-choose';
import { StatsCounter } from '@/components/home/stats-counter';
import { ShopByConcern } from '@/components/home/shop-by-concern';
import { Testimonials } from '@/components/home/testimonials';
import { BlogSection } from '@/components/home/blog-section';
import { InstagramGallery } from '@/components/home/instagram-gallery';
import { FAQSection } from '@/components/home/faq-section';

export const revalidate = 3600;

function ProductSectionsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-4">
      <Skeleton className="h-8 w-56" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

// Bagian ini butuh 3 query DB (featured, catalog, sales map) — dipisah dari
// section lain (Hero, CategoryShowcase, dll) yang tidak butuh data produk,
// supaya section-section itu bisa langsung dirender tanpa menunggu DB.
async function ProductSections() {
  const [featuredRaw, catalogRaw, salesMap] = await Promise.all([
    getCachedProductsList(
      { isPublished: true, OR: [{ isBestSeller: true }, { isNew: true }] },
      { reviewCount: 'desc' },
      8
    ),
    getCachedProductsList({ isPublished: true }, { createdAt: 'desc' }),
    getProductSalesMap(),
  ]);

  const featured = mapPrismaProducts(featuredRaw);
  const catalog = mapPrismaProducts(catalogRaw);
  // Tab "Most Popular" di ProductCatalog butuh urutan berdasarkan penjualan asli,
  // bukan urutan createdAt milik catalogRaw — jadi diurutkan ulang secara terpisah
  // supaya tab "Newest" (yang mengandalkan urutan createdAt desc dari catalog) tetap utuh.
  const popular = mapPrismaProducts(sortByPopularity(catalogRaw, salesMap));

  return (
    <>
      <FeaturedProducts products={featured} />
      <PromoSection>
        <PromoBanner />
      </PromoSection>
      <ProductCatalog products={catalog} popular={popular} />
    </>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <Suspense fallback={<ProductSectionsSkeleton />}>
        <ProductSections />
      </Suspense>
      <BrandAmbassador />
      <WhyChoose />
      <StatsCounter />
      <ShopByConcern />
      <Testimonials />
      <BlogSection />
      <InstagramGallery />
      <FAQSection />
    </>
  );
}

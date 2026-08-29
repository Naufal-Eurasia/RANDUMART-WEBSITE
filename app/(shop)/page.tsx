import { prisma } from '@/lib/prisma';
import { mapPrismaProducts } from '@/lib/product-mapper';
import { getProductSalesMap, sortByPopularity } from '@/lib/product-popularity';
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

export const revalidate = 60;

export default async function Home() {
  const [featuredRaw, catalogRaw, salesMap] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true, OR: [{ isBestSeller: true }, { isNew: true }] },
      include: { images: true, category: true },
      take: 8,
      orderBy: { reviewCount: 'desc' },
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      include: { images: true, category: true },
      orderBy: { createdAt: 'desc' },
    }),
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
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts products={featured} />
      <PromoSection>
        <PromoBanner />
      </PromoSection>
      <ProductCatalog products={catalog} popular={popular} />
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

import { prisma } from '@/lib/prisma';
import { mapPrismaProducts } from '@/lib/product-mapper';
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
  const [featuredRaw, catalogRaw] = await Promise.all([
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
  ]);

  const featured = mapPrismaProducts(featuredRaw);
  const catalog = mapPrismaProducts(catalogRaw);

  return (
    <>
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts products={featured} />
      <PromoSection>
        <PromoBanner />
      </PromoSection>
      <ProductCatalog products={catalog} />
      <BrandAmbassador />
      <WhyChoose />
      {/* <StatsCounter /> Disembunyikan: angka overclaim palsu (380+ produk padahal 84, 25k pelanggan padahal 8). Tampilkan lagi jika terhubung ke DB. */}
      <ShopByConcern />
      <Testimonials />
      <BlogSection />
      <InstagramGallery />
      <FAQSection />
    </>
  );
}

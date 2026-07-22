import { Hero } from '@/components/home/hero';
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

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <PromoSection />
      <ProductCatalog />
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

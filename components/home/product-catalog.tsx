'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/product/product-card';
import { Product } from '@/lib/types';

const tabs = [
  { key: 'newest', label: 'Newest' },
  { key: 'best-seller', label: 'Best Seller' },
  { key: 'recommended', label: 'Recommended' },
  { key: 'popular', label: 'Most Popular' },
  { key: 'limited', label: 'Limited Edition' },
] as const;

type TabKey = typeof tabs[number]['key'];

function getProducts(key: TabKey, products: Product[]) {
  switch (key) {
    case 'newest':
      return products.filter((p) => p.isNew);
    case 'best-seller':
      return products.filter((p) => p.bestSeller);
    case 'limited':
      return products.filter((p) => p.limited);
    case 'recommended':
      return products.filter((p) => p.tags.includes('immunity') || p.tags.includes('brightening'));
    case 'popular':
      return [...products].sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return products;
  }
}

export function ProductCatalog({ products }: { products: Product[] }) {
  const [active, setActive] = useState<TabKey>('best-seller');
  const list = getProducts(active, products);

  return (
    <section className="py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
            Katalog Produk
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Belanja per Kategori</h2>
          <p className="mt-2 text-muted-foreground">Geser untuk menjelajahi produk dari berbagai kategori.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 overflow-x-auto no-scrollbar">
          <div className="inline-flex gap-2 p-1.5 rounded-full bg-muted">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  active === t.key ? 'bg-brand-emerald text-white shadow-soft' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Swiper
          modules={[FreeMode, Autoplay]}
          slidesPerView={2}
          spaceBetween={16}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="!pb-2"
        >
          {list.map((p, i) => (
            <SwiperSlide key={p.id} className="!h-auto">
              <ProductCard product={p} index={i} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

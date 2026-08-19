'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { products } from '@/lib/products';

const showcaseImages = [
  '/images/katalog%20produk/foto_laku_estetik_20260730_152140_3.png',
  '/images/katalog%20produk/foto_laku_estetik_20260730_152350_2.png',
  '/images/katalog%20produk/foto_laku_estetik_20260730_155439_3.png',
  '/images/katalog%20produk/foto_laku_estetik_20260730_155519_3.png',
  '/images/katalog%20produk/foto_laku_estetik_20260730_160612_1.png',
  '/images/katalog%20produk/foto_laku_estetik_20260730_161146_4.png',
  '/images/katalog%20produk/foto_laku_estetik_20260730_161248_2.png',
  '/images/katalog%20produk/foto_laku_estetik_20260730_161502_2.png',
  '/images/katalog%20produk/foto_laku_estetik_20260730_161614_4.png',
  '/images/katalog%20produk/foto_laku_estetik_20260730_161820_1.png',
  '/images/katalog%20produk/foto_laku_estetik_20260731_102747_3.png',
  '/images/katalog%20produk/foto_laku_estetik_20260731_104332_1.png',
];

function shuffleImages(items: string[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function FeaturedProducts() {
  const featured = products.filter((p) => p.bestSeller || p.isNew).slice(0, 8);
  const [displayImages, setDisplayImages] = useState(showcaseImages.slice(0, featured.length));

  useEffect(() => {
    setDisplayImages(shuffleImages(showcaseImages).slice(0, featured.length));
  }, [featured.length]);

  return (
    <section className="py-20 lg:py-24 bg-brand-cream/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-3">
              Pilihan Terbaik
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Produk Unggulan</h2>
            <p className="mt-2 text-muted-foreground">Produk best seller dan new arrival paling diminati.</p>
          </motion.div>
          <Link href="/products" className="hidden sm:block">
            <Button variant="outline" className="rounded-full">
              Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} imageSrc={showcaseImages[i % showcaseImages.length]} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products">
            <Button variant="outline" className="rounded-full">Lihat Semua <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

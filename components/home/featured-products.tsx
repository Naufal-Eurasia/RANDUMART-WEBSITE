'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { Product } from '@/lib/types';

export function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = products;

  return (
    <section className="py-12 lg:py-16 bg-background">
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
            <ProductCard key={p.id} product={p} index={i} />
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

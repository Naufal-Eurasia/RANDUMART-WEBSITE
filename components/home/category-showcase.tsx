'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCategories } from '@/hooks/use-categories';

export function CategoryShowcase() {
  const { categories } = useCategories();

  return (
    <section id="categories" className="py-12 lg:py-16 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
            Jelajahi Koleksi
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
            Belanja berdasarkan Kategori
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            Setiap kategori memiliki identitas visual sendiri. Temukan produk favorit Anda dengan mudah.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="group relative block aspect-[3/4] rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-all duration-500 hover:-translate-y-1.5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />

                {/* Glassmorphism label */}
                <div className="absolute inset-x-3 bottom-3">
                  <div className="glass rounded-2xl p-4 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{cat.emoji}</span>
                      <h3 className="font-display font-bold text-lg text-foreground">{cat.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{cat.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary">{cat.productCount} produk</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Color accent bar */}
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full shadow-soft"
                  style={{ background: cat.color }}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

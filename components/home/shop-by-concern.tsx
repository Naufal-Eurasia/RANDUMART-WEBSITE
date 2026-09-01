'use client';

import { motion } from 'framer-motion';
import { concerns } from '@/lib/categories';
import Link from 'next/link';

export function ShopByConcern() {
  return (
    <section className="py-12 lg:py-16 bg-brand-green/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
            Solusi Kulit &amp; Tubuh
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Shop by Concern</h2>
          <p className="mt-2 text-muted-foreground">Temukan produk sesuai kebutuhan kulit dan kesehatan Anda.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {concerns.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/products?concern=${c.slug}`}
                className="group relative block aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gambar Utama (Tetap Cerah) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Tombol Putih Ramping & Minimalis */}
                <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
                  <div className="bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-white/50 group-hover:bg-white group-hover:shadow-md transition-all duration-300 text-center max-w-[85%]">
                    <p className="font-display font-semibold text-[11px] sm:text-xs text-slate-800 tracking-tight truncate">
                      {c.name}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

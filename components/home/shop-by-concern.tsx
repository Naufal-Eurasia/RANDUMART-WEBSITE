'use client';

import { motion } from 'framer-motion';
import { concerns } from '@/lib/categories';
import Link from 'next/link';

export function ShopByConcern() {
  return (
    <section className="py-12 lg:py-16 bg-brand-emerald/5">
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
                className="group relative block aspect-square rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-all hover:-translate-y-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className={`absolute inset-0 bg-gradient-to-t ${c.color} opacity-80 group-hover:opacity-90 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-3">
                  <p className="font-display font-semibold text-sm">{c.name}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

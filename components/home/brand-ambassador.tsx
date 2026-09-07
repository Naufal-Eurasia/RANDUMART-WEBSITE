'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function BrandAmbassador() {
  return (
    <section id="ambassador" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Latar gradien murni CSS. Versi sebelumnya hotlink foto Unsplash:
          aset pihak ketiga bisa hilang/berubah kapan saja dan menambah satu
          permintaan jaringan hanya untuk hiasan yang tertutup overlay 90%. */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-green via-brand-green/90 to-brand-greenHover/70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Portrait Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-premium aspect-[4/5] max-w-md mx-auto bg-brand-green border-4 border-white/10 group">
              <img
                src="/images/natta reza BA.jpg"
                alt="Natta Reza, brand ambassador Randumart"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover absolute inset-0"
              />
            </div>
          </motion.div>

          {/* Content (Hanya Badge & Nama saja) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white order-1 lg:order-2 space-y-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-sm font-medium">
              <Star className="w-4 h-4 text-brand-gold" /> Brand Ambassador
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Nata Reza
            </h2>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Award, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BrandAmbassador() {
  return (
    <section id="ambassador" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/3784371/pexels-photo-3784371.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-emerald-900/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-premium aspect-[4/5] max-w-md mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Brand Ambassador"
                className="w-full h-full object-cover"
              />
              <button className="absolute inset-0 grid place-items-center bg-black/20 hover:bg-black/30 transition-colors group">
                <span className="grid place-items-center w-16 h-16 rounded-full glass shadow-premium group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                </span>
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white order-1 lg:order-2"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-sm font-medium mb-5">
              <Star className="w-4 h-4 text-brand-gold" /> Brand Ambassador
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Dr. Aisyah Rahman, PhD
            </h2>
            <p className="mt-2 text-brand-gold font-semibold">Pakar Herbal &amp; Kesehatan Holistik</p>
            <p className="mt-5 text-white/85 leading-relaxed max-w-lg">
              Dengan pengalaman lebih dari 15 tahun di bidang herbal dan kesehatan alami, Dr. Aisyah mempercayai SR12 sebagai mitra untuk menghadarkan produk alami berkualitas kepada keluarga Indonesia. Bersama, kami membangun gaya hidup sehat yang berkelanjutan.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
              {[
                { icon: Award, value: '15+', label: 'Tahun Pengalaman' },
                { icon: Heart, value: '10K+', label: 'Pasien Puas' },
                { icon: Star, value: '25+', label: 'Penghargaan' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <s.icon className="w-6 h-6 mx-auto text-brand-gold mb-1" />
                  <p className="font-display font-bold text-xl">{s.value}</p>
                  <p className="text-xs text-white/70">{s.label}</p>
                </div>
              ))}
            </div>

            <Link href="#" className="inline-block mt-8">
              <Button className="rounded-full bg-white text-brand-emerald hover:bg-brand-cream px-6">
                Lihat Cerita Selengkapnya
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

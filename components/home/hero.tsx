'use client';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    image: 'https://images.pexels.com/photos/4753990/pexels-photo-4753990.jpeg?auto=compress&cs=tinysrgb&w=1600',
    eyebrow: 'Herbal Alami',
    title: 'Hidup Sehat Dimulai dari Produk Alami Berkualitas',
    subtitle: 'Temukan berbagai produk herbal, skincare, beauty, personal care, hingga kebutuhan keluarga di Randumart Herbal.',
  },
  {
    image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=1600',
    eyebrow: 'Beauty & Skincare',
    title: 'Wajah Cerah, Kulit Sehat, Tampil Percaya Diri',
    subtitle: 'Rangkaian skincare premium dengan bahan alami teruji dermatologis untuk semua jenis kulit.',
  },
  {
    image: 'https://images.pexels.com/photos/3933254/pexels-photo-3933254.jpeg?auto=compress&cs=tinysrgb&w=1600',
    eyebrow: 'Keluarga Sehat',
    title: 'Perawatan Aman untuk Si Kecil dan Seluruh Keluarga',
    subtitle: 'Produk lembut, halal, dan BPOM terdaftar untuk kesehatan dan kebahagiaan keluarga.',
  },
];

export function Hero() {
  return (
    <section className="relative overflow-visible bg-gradient-to-b from-brand-emerald via-emerald-900 to-emerald-950">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        speed={900}
        className="h-[100svh] min-h-[680px] bg-emerald-950"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt={s.eyebrow} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-emerald-900/40 to-emerald-950/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/70 via-transparent to-transparent" />

              <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="max-w-2xl text-white pt-20"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-sm font-medium mb-5">
                    <Leaf className="w-4 h-4 text-brand-gold" /> {s.eyebrow}
                  </span>
                  <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-balance">
                    {s.title}
                  </h1>
                  <p className="mt-5 text-base sm:text-lg text-white/85 max-w-xl">{s.subtitle}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/products">
                      <Button size="lg" className="rounded-full bg-brand-emerald hover:bg-emerald-700 text-white px-7 h-12 text-base">
                        Belanja Sekarang <ArrowRight className="w-5 h-5 ml-1" />
                      </Button>
                    </Link>
                    <Link href="/#categories">
                      <Button size="lg" variant="outline" className="rounded-full bg-white/10 border-brand-gold/30 text-white hover:bg-white/20 hover:text-white px-7 h-12 text-base backdrop-blur">
                        Lihat Katalog
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Trust strip */}
      <div className="relative z-10 -mt-px">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl shadow-premium border border-border/60 -mb-8 p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Leaf, title: 'Bahan Alami', desc: 'Herbal & natural pilihan' },
              { icon: ShieldCheck, title: 'BPOM & Halal', desc: 'Terdaftar resmi' },
              { icon: Truck, title: 'Pengiriman Cepat', desc: 'Ke seluruh Indonesia' },
              { icon: ShieldCheck, title: 'Pembayaran Aman', desc: '100% terpercaya' },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="grid place-items-center w-11 h-11 rounded-2xl bg-brand-gold/15 text-brand-gold shrink-0">
                  <t.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

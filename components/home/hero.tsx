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
import { cn } from '@/lib/utils';

const slides = [
  {
    image: '/images/hero/hero-toko.jpg',
    alt: 'Toko Randumart Herbal & Souvenir Umrah di Jl. Randu Asri, Sidoarjo',
    // toko ada di kiri foto, digeser ke kanan supaya tidak tertutup teks
    position: 'object-[70%_center]',
    eyebrow: 'Toko Fisik Sidoarjo',
    title: 'Herbal & Souvenir Umrah, Langsung dari Toko Kami',
    subtitle: 'Jl. Randu Asri Blok F1 No.27, Sidoarjo. Herbal, kurma, sajadah, hingga fashion muslim.',
  },
  {
    image: '/images/hero/hero-parsel.jpg',
    alt: 'Rangkaian parsel dan hampers Randumart',
    position: 'object-center',
    eyebrow: 'Parsel & Hampers',
    title: 'Parsel Rapi untuk Momen Spesial',
    subtitle: 'Hampers isi pilihan, dirangkai dan dikirim langsung dari toko.',
  },
];

export function Hero() {
  return (
    <section className="relative -mt-16 lg:-mt-20">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        // EffectFade terdaftar tapi prop effect tidak pernah diset, jadi slide lama
        // menumpuk di atas slide baru (dua-duanya opacity 1) dan slide 2 tak pernah terlihat
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        rewind
        speed={900}
        className="h-[100svh] min-h-[600px]"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={s.alt}
                fetchPriority={i === 0 ? 'high' : 'low'}
                loading={i === 0 ? 'eager' : 'lazy'}
                className={cn('absolute inset-0 w-full h-full object-cover', s.position)}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

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
                  <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-[-0.02em] text-balance [text-shadow:0_2px_16px_rgba(0,0,0,0.55)]">
                    {s.title}
                  </h1>
                  <p className="mt-5 text-base sm:text-lg text-white/90 max-w-xl [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">{s.subtitle}</p>
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

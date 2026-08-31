'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Zap, Gift, Truck, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const promos = [
  { icon: Zap, title: 'Flash Sale 50% OFF', desc: 'Diskon spesial untuk produk terpilih. Buruan sebelum kehabisan!', color: 'from-orange-500 to-red-500', cta: 'Belanja Sekarang' },
  { icon: Gift, title: 'Bundle Hemat 30%', desc: 'Paket bundling skincare lengkap dengan harga lebih hemat.', color: 'from-emerald-500 to-teal-500', cta: 'Lihat Bundle' },
  { icon: Truck, title: 'Pengiriman Aman', desc: 'Dikemas rapi dengan bubble wrap ke seluruh Indonesia.', color: 'from-blue-500 to-cyan-500', cta: 'Beli Sekarang' },
  { icon: Clock, title: 'Limited Time Offer', desc: 'Voucher Rp25.000 untuk pembelian pertama Anda.', color: 'from-fuchsia-500 to-pink-500', cta: 'Pakai Voucher' },
];

function Countdown() {
  const [t, setT] = useState({ h: 8, m: 45, s: 30 });
  useEffect(() => {
    const id = setInterval(() => {
      setT((p) => {
        let { h, m, s } = p;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-1.5">
      {[t.h, t.m, t.s].map((v, i) => (
        <div key={i} className="grid place-items-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur text-white font-display font-bold text-lg">
          {pad(v)}
        </div>
      ))}
    </div>
  );
}

export function PromoSection({ children }: { children?: React.ReactNode }) {
  return (
    <section id="promo" className="py-12 lg:py-16 bg-brand-green/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-3">
            Penawaran Spesial
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Promo & Diskon Terbatas</h2>
        </motion.div>

        {/* Banner promo aktif dari admin (opsional) */}
        {children}

        {/* Flash sale banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-green to-brand-greenHover p-8 sm:p-10 mb-8 text-white">
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-brand-gold/20 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-white text-sm font-bold mb-4">
                <Zap className="w-4 h-4" /> FLASH SALE
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2">Diskon Hingga 50% Hari Ini!</h3>
              <p className="text-white/80 mb-5">Berakhir dalam:</p>
              <Countdown />
              <Link href="/products" className="inline-block mt-6">
                <Button className="bg-white text-brand-green hover:bg-brand-cream rounded-full px-6">Belanja Sekarang</Button>
              </Link>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {['Vitamin C Serum', 'Habbatussauda', 'Lipstick Matte', 'Body Lotion'].map((n, i) => (
                <div key={n} className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/20">
                  <div className="aspect-square rounded-xl bg-white/20 mb-2" />
                  <p className="text-sm font-medium">{n}</p>
                  <p className="text-xs text-brand-gold font-bold">-{[50, 40, 35, 45][i]}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={20}
          autoplay={{ delay: 4500 }}
          pagination={{ clickable: true }}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
        >
          {promos.map((p, i) => (
            <SwiperSlide key={i}>
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${p.color} p-6 text-white h-full min-h-[200px] flex flex-col`}>
                <p.icon className="w-8 h-8 mb-3" />
                <h3 className="font-display font-bold text-lg mb-1">{p.title}</h3>
                <p className="text-sm text-white/85 flex-1">{p.desc}</p>
                <button className="mt-4 inline-flex items-center text-sm font-semibold underline underline-offset-2">{p.cta}</button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

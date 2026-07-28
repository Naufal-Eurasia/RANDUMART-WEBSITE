'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/lib/products';

export function Testimonials() {
  return (
    <section className="py-20 lg:py-24 bg-brand-cream/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
            Testimoni
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Apa Kata Pelanggan Kami</h2>
          <p className="mt-2 text-muted-foreground">Ribuan pelanggan puas dengan produk Randumart Herbal.</p>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={20}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="!pb-12"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id} className="!h-auto">
              <div className="h-full rounded-3xl bg-white border border-border/60 p-6 shadow-soft flex flex-col">
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed flex-1">&ldquo;{t.comment}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location} • {t.product}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

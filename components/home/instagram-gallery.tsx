'use client';

import { motion } from 'framer-motion';
import { Instagram, Heart } from 'lucide-react';

const images = [
  'https://images.pexels.com/photos/4753990/pexels-photo-4753990.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/56882/pexels-photo-56882.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3933254/pexels-photo-3933254.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/4202924/pexels-photo-4202924.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export function InstagramGallery() {
  return (
    <section className="py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-sm font-semibold mb-3">
            <Instagram className="w-4 h-4" /> @sr12official
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Ikuti Kami di Instagram</h2>
          <p className="mt-2 text-muted-foreground">Inspo gaya hidup sehat & kecantikan alami.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {images.map((src, i) => (
            <motion.a
              key={i}
              href="#"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors grid place-items-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-white text-sm font-semibold">
                  <Heart className="w-5 h-5 fill-white" /> 1.2K
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

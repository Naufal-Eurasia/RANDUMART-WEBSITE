'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

// Daftar 3 foto Nagita Slavina di folder public/images/.
// Alt ditulis per foto: pembaca layar membacakan ketiganya berurutan saat
// slider berganti, jadi teks generik yang sama tiga kali tidak memberi info.
const ambassadorImages = [
  { src: '/images/NAGITA SLAVINA 1.jpg', alt: 'Nagita Slavina, brand ambassador Randumart, berpose mengenakan busana formal' },
  { src: '/images/NAGITA SLAVINA 2.jpeg', alt: 'Nagita Slavina tersenyum ke kamera dalam sesi pemotretan Randumart' },
  { src: '/images/NAGITA SLAVINA.jpg', alt: 'Potret Nagita Slavina sebagai wajah rangkaian produk perawatan Randumart' },
];

export function BrandAmbassador() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pindah ke foto berikutnya
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % ambassadorImages.length);
  }, []);

  // Pindah ke foto sebelumnya
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + ambassadorImages.length) % ambassadorImages.length);
  }, []);

  // Otomatis berganti setiap 4 detik
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <section id="ambassador" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Latar gradien murni CSS. Versi sebelumnya hotlink foto Unsplash:
          aset pihak ketiga bisa hilang/berubah kapan saja dan menambah satu
          permintaan jaringan hanya untuk hiasan yang tertutup overlay 90%. */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-green via-brand-green/90 to-brand-greenHover/70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Portrait Image Slider (Otomatis & Panah Manual) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-premium aspect-[4/5] max-w-md mx-auto bg-brand-green border-4 border-white/10 group">

              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={ambassadorImages[currentIndex].src}
                  alt={ambassadorImages[currentIndex].alt}
                  loading="lazy"
                  decoding="async"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover absolute inset-0"
                />
              </AnimatePresence>

              {/* Tombol Panah Kiri */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/70 hover:scale-110 active:scale-95 transition-all z-20"
                aria-label="Foto Sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Tombol Panah Kanan */}
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/70 hover:scale-110 active:scale-95 transition-all z-20"
                aria-label="Foto Selanjutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Indikator Dots */}
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-20">
                {ambassadorImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Tampilkan foto ke-${i + 1} dari ${ambassadorImages.length}`}
                    aria-current={i === currentIndex}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>

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
              Nagita Slavina
            </h2>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

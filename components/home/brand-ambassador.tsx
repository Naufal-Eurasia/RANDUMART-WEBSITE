'use client';

import { motion } from 'framer-motion';

// Poster kampanye SR12 sudah memuat logo, headline, dan wordmark sendiri.
// Karena itu section ini tidak lagi punya heading/copy terpisah: teks ganda
// akan saling bertabrakan. Latar brand-cream dipilih supaya menyatu dengan
// gradien krem poster — overlay hijau lama justru menutupi headline emasnya.
export function BrandAmbassador() {
  return (
    <section id="ambassador" className="py-12 lg:py-16 bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          {/* Tanpa tinggi tetap & tanpa object-fit: poster 1:1 mengatur
              tingginya sendiri, jadi logo di tepi atas/bawah tidak pernah
              terpotong di lebar berapa pun. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ambassador/sr12-poster.jpg"
            alt="Poster SR12: Beauty is Not a Dream, Bring Back Your Beauty. Rangkaian SR Kiddos, SR12 Skin Care, dan SR12 Herbal — dari Indonesia untuk dunia."
            width={1080}
            height={1080}
            loading="lazy"
            decoding="async"
            className="w-full h-auto rounded-3xl shadow-soft"
          />
        </motion.div>
      </div>
    </section>
  );
}

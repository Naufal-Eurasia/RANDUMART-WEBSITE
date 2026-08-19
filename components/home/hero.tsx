'use client';

import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const heroCustomImage = '/images/katalog produk/Screenshot .png';

const imageCaptions: Record<string, { eyebrow: string; title: string; subtitle: string }> = {
  '/images/katalog produk/Screenshot .png': {
    eyebrow: 'Paket Oleh-Oleh',
    title: 'Paket Cup Oleh-Oleh Haji & Umrah',
    subtitle: 'Pilihan praktis untuk oleh-oleh haji dan umrah yang menarik.',
  },
  '/images/katalog produk/Screenshot 1.jpg': {
    eyebrow: 'Kurma Premium',
    title: 'Kurma Premium Tunisia Barari Alger',
    subtitle: 'Kurma premium pilihan dengan rasa manis khas Tunisia.',
  },
  '/images/katalog produk/Screenshot 2.png': {
    eyebrow: 'Air Zam-Zam',
    title: 'Paket Murah Air Zam-Zam',
    subtitle: 'Paket hemat air zam-zam siap untuk kebutuhan spiritual Anda.',
  },
  '/images/katalog produk/Screenshot 3.png': {
    eyebrow: 'Kurma Mesir',
    title: 'Kurma Mesir Golden Valley',
    subtitle: 'Kurma Mesir berkualitas tinggi, cocok untuk keluarga dan oleh-oleh.',
  },
  '/images/katalog produk/foto_laku_estetik_20260730_152140_3.png': {
    eyebrow: 'Facial Wash Series',
    title: 'Facial Wash Honey, Coffee, Green Tea & Bulus',
    subtitle: 'Seri sabun wajah natural untuk pembersihan, menyegarkan, dan melembapkan kulit.',
  },
  '/images/katalog produk/foto_laku_estetik_20260730_152350_2.png': {
    eyebrow: 'Facial Soap',
    title: 'Coffee, Rice, Milky Rice, Bulus & Honey Soap',
    subtitle: 'Sabun wajah pilihan dengan bahan kopi, beras, madu, dan bulus untuk kulit bersih.',
  },
  '/images/katalog produk/foto_laku_estetik_20260730_155439_3.png': {
    eyebrow: 'Sheet Mask & Masker',
    title: 'Sheet Mask Brightening, Acne & Kefir Powder',
    subtitle: 'Perawatan wajah lengkap dengan sheet mask, mask powder, dan clay mask untuk kulit cerah.',
  },
  '/images/katalog produk/foto_laku_estetik_20260730_155519_3.png': {
    eyebrow: 'Lip Care',
    title: 'Lip Mousse Cream & Lip Tint Gel Sweet Orange',
    subtitle: 'Perawatan bibir lembap dengan pilihan warna natural dan formula matte tahan lama.',
  },
  '/images/katalog produk/foto_laku_estetik_20260730_160612_1.png': {
    eyebrow: 'Makeup Series',
    title: 'Perfect Cushion, BB Cream & Cream Blush',
    subtitle: 'Produk makeup untuk coverage natural, warna kulit merata, dan pipi segar.',
  },
  '/images/katalog produk/foto_laku_estetik_20260730_161146_4.png': {
    eyebrow: 'Lip Makeup',
    title: 'Lip Mousse Cream & Lip Tint Gel',
    subtitle: 'Kombinasi lip mousse dan lip tint untuk hasil bibir lembap dan berpigmen.',
  },
  '/images/katalog produk/foto_laku_estetik_20260730_161248_2.png': {
    eyebrow: 'Pasta Gigi Herbal',
    title: 'Pasta Gigi Siwak & Sirih dan Charcoal',
    subtitle: 'Pasta gigi herbal untuk mulut segar dan perlindungan dari kotoran dan plak.',
  },
  '/images/katalog produk/foto_laku_estetik_20260731_102747_3.png': {
    eyebrow: 'Pasta Gigi Premium',
    title: 'Pasta Gigi Siwak & Sirih dan Charcoal',
    subtitle: 'Dua varian pasta gigi herbal untuk kebersihan gigi maksimal.',
  },
  '/images/katalog produk/foto_laku_estetik_20260731_104332_1.png': {
    eyebrow: 'Massage Oil',
    title: 'Massage Oil Bulus',
    subtitle: 'Massage oil bulus untuk relaksasi dan menjaga kelembapan kulit saat pijat.',
  },
  '/images/katalog produk/foto_laku_estetik_20260731_104634_4.png': {
    eyebrow: 'Women Care',
    title: 'Miss Manja Spray & Wash',
    subtitle: 'Produk care untuk area kewanitaan dengan formula lembut dan segar.',
  },
  '/images/katalog produk/Gemini_Generated_Image_79zotu79zotu79zo.png': {
    eyebrow: 'Katalog Visual',
    title: 'Desain Produk Herbal Modern',
    subtitle: 'Ilustrasi katalog dengan gaya modern untuk produk herbal dan kecantikan.',
  },
  '/images/katalog produk/Gemini_Generated_Image_818gis818gis818g.png': {
    eyebrow: 'Kreasi Kemas',
    title: 'Konsep Kemasan Premium',
    subtitle: 'Visual kemasan premium untuk produk kesehatan dan lifestyle.',
  },
  '/images/katalog produk/Gemini_Generated_Image_b65rr5b65rr5b65r.png': {
    eyebrow: 'Produk Natural',
    title: 'Konsep Produk Natural & Organik',
    subtitle: 'Desain katalog bernuansa natural, cocok untuk produk organik.',
  },
  '/images/katalog produk/Gemini_Generated_Image_bvc9pbvc9pbvc9pb.png': {
    eyebrow: 'Minimalis Elegan',
    title: 'Katalog Minimalis Elegan',
    subtitle: 'Gaya desain bersih dan elegan untuk katalog produk kecantikan.',
  },
  '/images/katalog produk/Gemini_Generated_Image_bwoltebwoltebwol.png': {
    eyebrow: 'Aromaterapi',
    title: 'Katalog Aroma Alami',
    subtitle: 'Visual katalog aromaterapi untuk produk perawatan tubuh dan relaksasi.',
  },
  '/images/katalog produk/Gemini_Generated_Image_dzzhm8dzzhm8dzzh.png': {
    eyebrow: 'Sentuhan Alam',
    title: 'Konsep Alam & Kebugaran',
    subtitle: 'Desain katalog dengan elemen alam untuk gaya hidup sehat.',
  },
  '/images/katalog produk/Gemini_Generated_Image_fc9tpofc9tpofc9t.png': {
    eyebrow: 'Packaging Artistik',
    title: 'Desain Packaging Artistik',
    subtitle: 'Ilustrasi packaging yang artistik dan menarik perhatian.',
  },
  '/images/katalog produk/Gemini_Generated_Image_g52rfig52rfig52r.png': {
    eyebrow: 'Koleksi Wellness',
    title: 'Visual Wellness Collection',
    subtitle: 'Konsep katalog produk wellness yang modern dan premium.',
  },
  '/images/katalog produk/Gemini_Generated_Image_ha3669ha3669ha36.png': {
    eyebrow: 'Produk Boost',
    title: 'Konsep Produk Boost Energi',
    subtitle: 'Ilustrasi produk herbal untuk meningkatkan energi dan kesehatan.',
  },
  '/images/katalog produk/Gemini_Generated_Image_hd96snhd96snhd96.png': {
    eyebrow: 'Pola Wellness',
    title: 'Desain Poster Wellness',
    subtitle: 'Visual poster katalog untuk produk wellness dan perawatan diri.',
  },
  '/images/katalog produk/Gemini_Generated_Image_i7kbpyi7kbpyi7kb.png': {
    eyebrow: 'Seri Skincare',
    title: 'Konsep Skincare Series',
    subtitle: 'Gaya visual katalog untuk rangkaian skincare alami.',
  },
  '/images/katalog produk/Gemini_Generated_Image_j32cu0j32cu0j32c.png': {
    eyebrow: 'Promo Produk',
    title: 'Ilustrasi Promo Produk',
    subtitle: 'Desain katalog untuk promosi produk kesehatan dan kecantikan.',
  },
  '/images/katalog produk/Gemini_Generated_Image_kt8uu6kt8uu6kt8u.png': {
    eyebrow: 'Konsep Sehat',
    title: 'Visual Konsep Gaya Hidup Sehat',
    subtitle: 'Ilustrasi produk yang menonjolkan gaya hidup sehat dan alami.',
  },
  '/images/katalog produk/Gemini_Generated_Image_ktp7exktp7exktp7.png': {
    eyebrow: 'Katalog Eksklusif',
    title: 'Katalog Produk Eksklusif',
    subtitle: 'Desain mewah yang cocok untuk koleksi produk eksklusif.',
  },
  '/images/katalog produk/Gemini_Generated_Image_orkwiaorkwiaorkw.png': {
    eyebrow: 'Gaya Elegan',
    title: 'Visual Elegan Katalog',
    subtitle: 'Konsep desain elegan untuk produk kecantikan dan gift set.',
  },
  '/images/katalog produk/Gemini_Generated_Image_prlj1prlj1prlj1p.png': {
    eyebrow: 'Mood Modern',
    title: 'Desain Katalog Modern',
    subtitle: 'Gaya visual modern untuk katalog produk lifestyle.',
  },
  '/images/katalog produk/Gemini_Generated_Image_r5gkdwr5gkdwr5gk.png': {
    eyebrow: 'Katalog Premium',
    title: 'Konsep Katalog Premium',
    subtitle: 'Visual premium untuk produk perawatan tubuh dan kecantikan.',
  },
  '/images/katalog produk/Gemini_Generated_Image_rezevxrezevxreze.png': {
    eyebrow: 'Nuansa Natural',
    title: 'Desain Nuansa Natural',
    subtitle: 'Ilustrasi katalog dengan nuansa warna alami dan segar.',
  },
  '/images/katalog produk/Gemini_Generated_Image_skr21uskr21uskr2.png': {
    eyebrow: 'Gift Set',
    title: 'Konsep Gift Set Katalog',
    subtitle: 'Desain produk gift set untuk paket hadiah dan oleh-oleh.',
  },
  '/images/katalog produk/Gemini_Generated_Image_tvwofxtvwofxtvwo.png': {
    eyebrow: 'Katalog Artistik',
    title: 'Visual Artistik untuk Katalog',
    subtitle: 'Ilustrasi artistik yang menarik untuk presentasi produk.',
  },
};

function getCaptionForImage(image: string) {
  const mapped = imageCaptions[image];
  if (mapped) {
    return mapped;
  }

  const fileName = image.split('/').pop() ?? '';
  const name = fileName.replace(/\.[^/.]+$/, '').replace(/[_]+/g, ' ').replace(/ +/g, ' ').trim();
  const normalized = name.toLowerCase();

  if (/screenshot/i.test(name)) {
    const label = name.replace(/screenshot/i, '').trim() || 'Unggulan';
    return {
      eyebrow: 'Foto Unggulan',
      title: `Screenshot ${label}`.trim(),
      subtitle: `Gambar katalog produk: ${label || 'Unggulan'} untuk koleksi Randumart.`,
    };
  }

  if (/foto laku estetik/i.test(normalized)) {
    const label = name.replace(/foto laku estetik/i, '').trim();
    return {
      eyebrow: 'Foto Produk Terlaris',
      title: label ? `Foto Laku Estetik ${label}` : 'Foto Laku Estetik Terbaru',
      subtitle: label
        ? `Visual produk estetik dengan nomor kode ${label}. Cocok untuk katalog dan promosi.`
        : 'Produk estetik populer di katalog kami.',
    };
  }

  if (/gemini generated image/i.test(normalized)) {
    const label = name.replace(/gemini generated image/i, '').trim();
    return {
      eyebrow: 'Desain Katalog',
      title: label ? `Gemini Image ${label}` : 'Gemini Generated Image',
      subtitle: label
        ? `Konsep visual produk dengan nama ${label}. Cocok untuk katalog modern.`
        : 'Desain produk kreatif hasil generasi AI.',
    };
  }

  return {
    eyebrow: 'Produk Randumart',
    title: name ? `${name}` : 'Katalog Produk',
    subtitle: name ? `Gambar katalog produk: ${name}.` : 'Temukan pilihan produk terbaik untuk kesehatan dan kecantikan.',
  };
}

const catalogImages = [
  heroCustomImage,
  '/images/katalog produk/foto_laku_estetik_20260730_152140_3.png',
  '/images/katalog produk/foto_laku_estetik_20260730_152350_2.png',
  '/images/katalog produk/foto_laku_estetik_20260730_155439_3.png',
  '/images/katalog produk/foto_laku_estetik_20260730_155519_3.png',
  '/images/katalog produk/foto_laku_estetik_20260730_160612_1.png',
  '/images/katalog produk/foto_laku_estetik_20260730_161146_4.png',
  '/images/katalog produk/foto_laku_estetik_20260730_161248_2.png',
  '/images/katalog produk/foto_laku_estetik_20260730_161502_2.png',
  '/images/katalog produk/foto_laku_estetik_20260730_161614_4.png',
  '/images/katalog produk/foto_laku_estetik_20260730_161820_1.png',
  '/images/katalog produk/foto_laku_estetik_20260731_102747_3.png',
  '/images/katalog produk/foto_laku_estetik_20260731_104332_1.png',
  '/images/katalog produk/foto_laku_estetik_20260731_104634_4.png',
  '/images/katalog produk/foto_laku_estetik_20260731_105620_4.png',
  '/images/katalog produk/foto_laku_estetik_20260731_105701_3.png',
  '/images/katalog produk/foto_laku_estetik_20260731_105911_2.png',
  '/images/katalog produk/foto_laku_estetik_20260731_110401_1.png',
  '/images/katalog produk/foto_laku_estetik_20260731_110444_4.png',
  '/images/katalog produk/foto_laku_estetik_20260731_110533_1.png',
  '/images/katalog produk/foto_laku_estetik_20260731_110611_1.png',
  '/images/katalog produk/foto_laku_estetik_20260731_112748_1.png',
  '/images/katalog produk/foto_laku_estetik_20260731_113320_3.png',
  '/images/katalog produk/foto_laku_estetik_20260801_181210_4.png',
  '/images/katalog produk/foto_laku_estetik_20260801_181403_3.png',
  '/images/katalog produk/foto_laku_estetik_20260801_181456_1.png',
  '/images/katalog produk/foto_laku_estetik_20260801_181610_2.png',
  '/images/katalog produk/foto_laku_estetik_20260801_181935_3.png',
  '/images/katalog produk/foto_laku_estetik_20260801_182049_3.png',
  '/images/katalog produk/foto_laku_estetik_20260801_182523_2.png',
  '/images/katalog produk/foto_laku_estetik_20260801_182935_2.png',
  '/images/katalog produk/foto_laku_estetik_20260801_183039_1.png',
  '/images/katalog produk/foto_laku_estetik_20260801_183242_3.png',
  '/images/katalog produk/foto_laku_estetik_20260801_184017_1.png',
  '/images/katalog produk/foto_laku_estetik_20260801_184113_4.png',
  '/images/katalog produk/foto_laku_estetik_20260801_184256_3.png',
  '/images/katalog produk/foto_laku_estetik_20260801_184353_1.png',
  '/images/katalog produk/foto_laku_estetik_20260801_184636_2.png',
  '/images/katalog produk/foto_laku_estetik_20260801_184744_1.png',
  '/images/katalog produk/Gemini_Generated_Image_79zotu79zotu79zo.png',
  '/images/katalog produk/Gemini_Generated_Image_818gis818gis818g.png',
  '/images/katalog produk/Gemini_Generated_Image_b65rr5b65rr5b65r.png',
  '/images/katalog produk/Gemini_Generated_Image_bvc9pbvc9pbvc9pb.png',
  '/images/katalog produk/Gemini_Generated_Image_bwoltebwoltebwol.png',
  '/images/katalog produk/Gemini_Generated_Image_dzzhm8dzzhm8dzzh.png',
  '/images/katalog produk/Gemini_Generated_Image_fc9tpofc9tpofc9t.png',
  '/images/katalog produk/Gemini_Generated_Image_g52rfig52rfig52r.png',
  '/images/katalog produk/Gemini_Generated_Image_ha3669ha3669ha36.png',
  '/images/katalog produk/Gemini_Generated_Image_hd96snhd96snhd96.png',
  '/images/katalog produk/Gemini_Generated_Image_i7kbpyi7kbpyi7kb.png',
  '/images/katalog produk/Gemini_Generated_Image_j32cu0j32cu0j32c.png',
  '/images/katalog produk/Gemini_Generated_Image_kt8uu6kt8uu6kt8u.png',
  '/images/katalog produk/Gemini_Generated_Image_ktp7exktp7exktp7.png',
  '/images/katalog produk/Gemini_Generated_Image_orkwiaorkwiaorkw.png',
  '/images/katalog produk/Gemini_Generated_Image_prlj1prlj1prlj1p.png',
  '/images/katalog produk/Gemini_Generated_Image_r5gkdwr5gkdwr5gk.png',
  '/images/katalog produk/Gemini_Generated_Image_rezevxrezevxreze.png',
  '/images/katalog produk/Gemini_Generated_Image_skr21uskr21uskr2.png',
  '/images/katalog produk/Gemini_Generated_Image_tvwofxtvwofxtvwo.png',  
  '/images/katalog produk/Screenshot .png',
  '/images/katalog produk/Screenshot 1.jpg',
  '/images/katalog produk/Screenshot 2.png',
  '/images/katalog produk/Screenshot 3.png',];

export function Hero() {
  const slides = catalogImages.map((image) => ({
    ...getCaptionForImage(image),
    image,
  }));

  return (
    <section className="relative overflow-hidden bg-background">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        speed={900}
        className="min-h-[420px] lg:min-h-[520px] bg-background py-10"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full flex justify-center px-4 sm:px-6 lg:px-0">
              <div className="w-full max-w-[1100px]">
                <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
                  <div className="w-full bg-white">
                    <Image
                      src={s.image}
                      alt={s.eyebrow}
                      width={900}
                      height={1200}
                      quality={90}
                      className="w-full h-auto object-contain object-center"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 900px"
                    />
                  </div>
                </div>
                <div className="mt-6 w-full rounded-[24px] bg-slate-950 px-6 py-8 sm:px-8 sm:py-10 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] min-h-[120px]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="w-full max-w-[980px]"
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium text-white mb-4">
                      <Leaf className="w-4 h-4 text-brand-gold" /> {s.eyebrow}
                    </span>
                    <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                      {s.title}
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-white/80 max-w-3xl">
                      {s.subtitle}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link href="/products">
                        <Button size="lg" className="rounded-full bg-white text-black px-6 h-12 text-sm font-semibold hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors">
                          Belanja Sekarang
                        </Button>
                      </Link>
                      <Link href="/#categories">
                        <Button size="lg" className="rounded-full bg-white text-black px-6 h-12 text-sm font-semibold hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:bg-red-600 active:text-white transition-colors">
                          Lihat Katalog
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Trust strip */}
      <div className="relative z-10 -mt-px">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl shadow-premium border border-border/60 -mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {[
              { icon: Leaf, title: 'Bahan Alami', desc: 'Herbal & natural pilihan' },
              { icon: ShieldCheck, title: 'BPOM & Halal', desc: 'Terdaftar resmi' },
              { icon: Truck, title: 'Pengiriman Cepat', desc: 'Ke seluruh Indonesia' },
              { icon: ShieldCheck, title: 'Pembayaran Aman', desc: '100% terpercaya' },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-4 rounded-3xl bg-white/90 p-6 shadow-sm border border-slate-200/80 h-full">
                <div className="grid place-items-center w-12 h-12 rounded-2xl bg-brand-gold/15 text-brand-gold shrink-0">
                  <t.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950 leading-tight">{t.title}</p>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.desc}</p>
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

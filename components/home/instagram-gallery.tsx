'use client';

import { motion } from 'framer-motion';
import { Instagram, Heart, Video } from 'lucide-react';

const images = [
  {
    src: '/images/products/GOMILKU GOLD.jpg',
    link: 'https://www.instagram.com/reel/DYWDExlR_i5/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', 
    type: 'instagram'
  },
  {
    src: '/images/products/ACNE.jpg',
    link: 'https://www.instagram.com/p/DVuiVf0E4qS/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', // Contoh link konten Acne Care
    type: 'instagram'
  },
  {
    src: '/images/products/BAR SOAP.jpg',
    link: 'https://www.tiktok.com/@randumart.herbal/video/7605818776575069448?is_from_webapp=1&sender_device=pc', // Contoh link video TikTok
    type: 'tiktok'
  },
  {
    src: '/images/products/DEODORANT SPRAY.jpg',
    link: 'https://www.tiktok.com/@randumart.herbal/photo/7617656887219260693?is_from_webapp=1&sender_device=pc', // Contoh link reel Deodorant
    type: 'tiktok'
  },
  {
    src: '/images/products/DNA.png',
    link: 'https://www.instagram.com/reel/DEMgFIGT102/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', // Contoh link konten Face Wash
    type: 'instagram'
  },
  {
    src: '/images/products/LIP CARE NATURAL.jpg',
    link: 'https://www.tiktok.com/@randumart.herbal/video/7675135703340043540?is_from_webapp=1&sender_device=pc', // Contoh link video Lip Care
    type: 'tiktok'
  },
  {
    src: '/images/products/facialfoam.jpg',
    link: 'https://www.tiktok.com/@randumart.herbal/video/7599873995781049608?is_from_webapp=1&sender_device=pc', // Contoh link reel Facial Foam
    type: 'tiktok'
  },
  {
    src: '/images/products/GOMILKU.jpg',
    link: 'https://www.instagram.com/reel/DJt1IknTx-s/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==', // Contoh link video Gomilku
    type: 'instagram'
  },
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
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <a 
              href="https://www.instagram.com/randumart.official" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-xs font-semibold"
            >
              <Instagram className="w-4 h-4" /> @randumart.official
            </a>
            <a 
              href="https://www.instagram.com/sr12official_surabaya" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-xs font-semibold"
            >
              <Instagram className="w-4 h-4" /> @sr12official_surabaya
            </a>
            <a 
              href="https://www.tiktok.com/@randumart.herbal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-xs font-semibold"
            >
              <Video className="w-4 h-4" /> @randumart.herbal
            </a>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Ikuti Kami di Media Sosial</h2>
          <p className="mt-2 text-muted-foreground">Temukan tips kecantikan dan update produk terbaru setiap hari.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {images.map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors grid place-items-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white">
                  {item.type === 'instagram' ? <Instagram className="w-8 h-8" /> : <Video className="w-8 h-8" />}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

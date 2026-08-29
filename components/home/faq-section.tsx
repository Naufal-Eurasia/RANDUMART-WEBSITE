'use client';

import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Randumart menyediakan produk apa saja?',
    a: 'Randumart menyediakan berbagai produk herbal, makanan/minuman kesehatan, serta kebutuhan oleh-oleh untuk jamaah Umrah dan Haji. Produk dipilih untuk menjadi pilihan praktis bagi jamaah maupun keluarga yang ingin berbagi oleh-oleh setelah pulang dari Tanah Suci.',
  },
  {
    q: 'Apakah produk Randumart aman dan sudah memiliki izin edar?',
    a: 'Produk Randumart dipilih dari produk yang memenuhi ketentuan dan perizinan yang berlaku. Informasi izin edar, sertifikasi, dan legalitas produk dapat dilihat pada kemasan masing-masing produk sesuai kategorinya.',
  },
  {
    q: 'Apakah produk Randumart halal?',
    a: 'Randumart mengutamakan produk yang memiliki status halal sesuai ketentuan yang berlaku. Informasi sertifikasi halal dapat diperiksa pada kemasan atau detail masing-masing produk.',
  },
  {
    q: 'Apakah Randumart menyediakan paket oleh-oleh Umrah dan Haji?',
    a: 'Ya. Randumart dapat menyediakan pilihan paket oleh-oleh yang praktis untuk jamaah Umrah dan Haji, baik untuk kebutuhan pribadi maupun dibagikan kepada keluarga, kerabat, teman, dan rekan kerja.',
  },
  {
    q: 'Apakah bisa custom paket oleh-oleh?',
    a: 'Bisa. Untuk kebutuhan tertentu, seperti jumlah paket, pilihan produk, kemasan, maupun kebutuhan acara, pelanggan dapat berkonsultasi terlebih dahulu dengan tim Randumart.',
  },
  {
    q: 'Apakah bisa pesan dalam jumlah banyak?',
    a: 'Bisa. Randumart melayani pemesanan dalam jumlah besar untuk kebutuhan jamaah, keluarga, komunitas, perusahaan, maupun acara tertentu. Untuk pemesanan dalam jumlah besar, silakan hubungi tim Randumart untuk mendapatkan informasi stok dan penawaran terbaik.',
  },
  {
    q: 'Apakah Randumart melayani pengiriman ke seluruh Indonesia?',
    a: 'Randumart melayani pengiriman ke berbagai wilayah di Indonesia melalui jasa pengiriman yang tersedia. Estimasi waktu dan biaya pengiriman menyesuaikan tujuan, berat, jumlah pesanan, serta ekspedisi yang digunakan.',
  },
  {
    q: 'Bagaimana cara melakukan pemesanan?',
    a: 'Pelanggan dapat memilih produk melalui website, kemudian menghubungi kontak/WhatsApp Randumart untuk melakukan konfirmasi pesanan. Tim Randumart akan membantu proses pemesanan hingga pengiriman.',
  },
  {
    q: 'Apakah produk bisa digunakan sebagai oleh-oleh setelah pulang Umrah/Haji?',
    a: 'Tentu. Randumart menyediakan berbagai pilihan produk yang praktis untuk dijadikan buah tangan bagi keluarga, sahabat, tetangga, maupun rekan kerja.',
  },
  {
    q: 'Apakah tersedia paket untuk kebutuhan rombongan Umrah/Haji?',
    a: 'Ya. Randumart dapat membantu menyiapkan kebutuhan oleh-oleh untuk rombongan dalam jumlah tertentu. Detail paket dapat disesuaikan berdasarkan jumlah jamaah, jenis produk, dan anggaran yang tersedia.',
  },
  {
    q: 'Bagaimana jika ingin konsultasi sebelum membeli?',
    a: 'Silakan hubungi tim Randumart melalui WhatsApp. Tim kami siap membantu memberikan informasi mengenai produk, paket oleh-oleh, jumlah pesanan, dan pilihan yang sesuai dengan kebutuhan Anda.',
  },
  {
    q: 'Di mana saya bisa mendapatkan informasi produk terbaru Randumart?',
    a: 'Ikuti media sosial resmi Randumart untuk mendapatkan informasi mengenai produk, paket oleh-oleh, promo, edukasi herbal, dan informasi terbaru lainnya.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-12 lg:py-16 bg-brand-green/5">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
            FAQ
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Pertanyaan yang Sering Diajukan</h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl bg-white border border-border/60 px-5 shadow-soft">
              <AccordionTrigger className="text-left font-display font-semibold text-base hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

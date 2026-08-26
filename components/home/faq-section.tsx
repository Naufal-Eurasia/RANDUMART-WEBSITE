'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'Apakah produk SR12 sudah terdaftar BPOM?', a: 'Ya, semua produk SR12 telah terdaftar resmi di BPOM dan sebagian besar bersertifikat Halal MUI. Nomor BPOM tertera pada setiap kemasan produk.' },
  { q: 'Berapa lama waktu pengiriman?', a: 'Pengiriman ke wilayah Jabodetabek 1-2 hari kerja, luar Jabodetabek 2-5 hari kerja, tergantung lokasi dan kurir yang dipilih.' },
  { q: 'Apakah ada gratis ongkir?', a: 'Ya, Anda mendapatkan gratis ongkir untuk pembelian minimal Rp150.000 ke seluruh Indonesia dengan kurir rekanan kami.' },
  { q: 'Bagaimana cara klaim promo atau voucher?', a: 'Pilih voucher pada halaman checkout, lalu masukkan kode voucher jika ada. Diskon akan otomatis diterapkan ke total belanja Anda.' },
  { q: 'Apakah produk aman untuk kulit sensitif?', a: 'Sebagian besar produk SR12 telah diuji dermatologis dan aman untuk kulit sensitif. Namun, kami menyarankan patch test sebelum penggunaan pertama.' },
  { q: 'Bagaimana cara mengembalikan produk?', a: 'Anda dapat mengajukan retur dalam 7 hari setelah menerima pesanan jika produk rusak atau tidak sesuai. Hubungi customer service kami untuk bantuan.' },
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

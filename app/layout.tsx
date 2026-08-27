import './globals.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Providers } from '@/components/providers';
import { CartSync } from '@/components/cart/cart-sync';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'), // TODO: ganti ke https://randumart.id saat domain aktif
  title: 'Randumart — Herbal, Souvenir Umrah & Produk Alami Berkualitas',
  description: 'Randumart — toko resmi produk herbal, skincare, beauty, souvenir umrah, suplemen, dan kebutuhan keluarga di Indonesia. Produk alami, BPOM & Halal.',
  keywords: ['herbal', 'skincare', 'beauty', 'suplemen', 'madu', 'Randumart', 'souvenir umrah', 'kesehatan', 'halal', 'BPOM'],
  openGraph: {
    title: 'Randumart',
    description: 'Herbal, Souvenir Umrah & Produk Alami Berkualitas',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans bg-background text-foreground min-h-screen flex flex-col">
        <Providers>
          <CartSync />
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}

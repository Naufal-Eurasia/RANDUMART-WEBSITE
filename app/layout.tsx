import './globals.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FloatingActions } from '@/components/layout/floating-actions';
import { MobileNav, BottomNav } from '@/components/layout/mobile-nav';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { WishlistDrawer } from '@/components/wishlist/wishlist-drawer';
import { SearchDialog } from '@/components/search/search-dialog';
import { Providers } from '@/components/providers';
import { CartSync } from '@/components/cart/cart-sync';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://sr12store.id'),
  title: 'SR12 Official Store — Hidup Sehat dengan Produk Alami Berkualitas',
  description: 'SR12 Official Store — toko resmi produk herbal, skincare, beauty, personal care, suplemen, dan kebutuhan keluarga di Indonesia. Produk alami, BPOM & Halal.',
  keywords: ['herbal', 'skincare', 'beauty', 'suplemen', 'madu', 'SR12', 'kesehatan', 'halal', 'BPOM'],
  openGraph: {
    title: 'SR12 Official Store',
    description: 'Hidup Sehat Dimulai dari Produk Alami Berkualitas',
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
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingActions />
          <MobileNav />
          <BottomNav />
          <CartDrawer />
          <WishlistDrawer />
          <SearchDialog />
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}

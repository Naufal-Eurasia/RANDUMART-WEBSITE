import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FloatingActions } from '@/components/layout/floating-actions';
import { MobileNav, BottomNav } from '@/components/layout/mobile-nav';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { WishlistDrawer } from '@/components/wishlist/wishlist-drawer';
import { SearchDialog } from '@/components/search/search-dialog';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
      <MobileNav />
      <BottomNav />
      <CartDrawer />
      <WishlistDrawer />
      <SearchDialog />
    </>
  );
}

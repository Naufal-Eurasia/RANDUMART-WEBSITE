'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useStore } from '@/lib/store';
import { navLinks, categories } from '@/lib/categories';
import Link from 'next/link';
import { ChevronDown, User, Home, Search, Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const { mobileNavOpen, setMobileNavOpen, setSearchOpen, setCartOpen, setWishlistOpen, cartCount, wishlist } = useStore();
  const [catOpen, setCatOpen] = useState(false);

  return (
    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetContent side="left" className="w-[88vw] max-w-sm p-0 flex flex-col">
        <SheetHeader className="p-5 border-b border-border">
          <SheetTitle className="flex items-center gap-3">
            <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/90 shadow-soft overflow-hidden">
              <img
                src="/images/randumart-logo.jpeg"
                alt="Randumart Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <div className="font-display font-bold text-base text-foreground">
                <span className="text-brand-emerald">Randum</span>
                <span className="text-brand-red">mart</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-brand-blue">Herbal & Souvenir Umrah</div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-1">
          {navLinks.map((link) =>
            link.mega ? (
              <div key={link.label}>
                <button
                  onClick={() => setCatOpen(!catOpen)}
                  className="w-full flex items-center justify-between py-3 px-3 rounded-xl hover:bg-muted font-medium"
                >
                  {link.label}
                  <ChevronDown className={cn('w-4 h-4 transition-transform', catOpen && 'rotate-180')} />
                </button>
                {catOpen && (
                  <div className="pl-3 grid grid-cols-2 gap-2 pb-2">
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/products?category=${c.slug}`}
                        onClick={() => setMobileNavOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-sm"
                      >
                        <span className="text-lg">{c.emoji}</span>
                        <span className="font-medium">{c.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="block py-3 px-3 rounded-xl hover:bg-muted font-medium"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="p-5 border-t border-border space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Link href="#" onClick={() => setMobileNavOpen(false)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border font-medium text-sm hover:bg-muted">
              <User className="w-4 h-4" /> Login
            </Link>
            <Link href="#" onClick={() => setMobileNavOpen(false)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-emerald text-white font-medium text-sm">
              Register
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function BottomNav() {
  const { setSearchOpen, setCartOpen, setWishlistOpen, cartCount, wishlist } = useStore();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border">
      <div className="grid grid-cols-5 h-16">
        <Link href="/" className="flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-brand-emerald">
          <Home className="w-5 h-5" /><span className="text-[10px] font-medium">Home</span>
        </Link>
        <button onClick={() => setSearchOpen(true)} className="flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-brand-emerald">
          <Search className="w-5 h-5" /><span className="text-[10px] font-medium">Search</span>
        </button>
        <button onClick={() => setWishlistOpen(true)} className="relative flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-brand-emerald">
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && <span className="absolute top-1 right-6 min-w-4 h-4 px-1 grid place-items-center rounded-full bg-accent text-white text-[9px] font-bold">{wishlist.length}</span>}
          <span className="text-[10px] font-medium">Wishlist</span>
        </button>
        <Link href="/products" className="flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-brand-emerald">
          <ShoppingBag className="w-5 h-5" /><span className="text-[10px] font-medium">Products</span>
        </Link>
        <button onClick={() => setCartOpen(true)} className="relative flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-brand-emerald">
          <ShoppingBag className="w-5 h-5" />
          {cartCount() > 0 && <span className="absolute top-1 right-6 min-w-4 h-4 px-1 grid place-items-center rounded-full bg-primary text-white text-[9px] font-bold">{cartCount()}</span>}
          <span className="text-[10px] font-medium">Cart</span>
        </button>
      </div>
    </nav>
  );
}

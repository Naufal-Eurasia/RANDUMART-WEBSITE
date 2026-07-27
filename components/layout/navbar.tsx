'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, User } from 'lucide-react';
import { navLinks, categories } from '@/lib/categories';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, wishlist, setSearchOpen, setCartOpen, setWishlistOpen, setMobileNavOpen } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Promo ribbon */}
      <div className="bg-gradient-to-r from-brand-emerald via-emerald-600 to-brand-emerald text-white text-xs sm:text-sm py-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0">
              {['Gratis ongkir min. Rp150.000', 'Flash Sale hingga 50% OFF', 'Produk BPOM & Halal terjamin', 'Pembayaran aman & terpercaya', 'New Arrival setiap minggu'].map((t, j) => (
                <span key={j} className="mx-6 inline-flex items-center gap-2 font-medium">
                  <span className="text-brand-gold">✦</span> {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-500',
          scrolled ? 'glass shadow-soft' : 'bg-transparent'
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-emerald to-emerald-700 text-white font-display font-bold text-lg shadow-soft">
                SR
              </div>
              <div className="hidden sm:block leading-none">
                <div className={cn('font-display font-bold text-lg tracking-tight', scrolled ? 'text-brand-emerald' : 'text-white')}>
                  SR12
                </div>
                <div className={cn('text-[10px] uppercase tracking-[0.2em] font-medium', scrolled ? 'text-muted-foreground' : 'text-white/70')}>
                  Official Store
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.mega ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                  >
                    <button
                      className={cn(
                        'inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        scrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10'
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn('w-4 h-4 transition-transform', megaOpen && 'rotate-180')} />
                    </button>
                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 12 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[min(92vw,900px)]"
                        >
                          <div className="glass rounded-3xl shadow-premium border border-border/60 p-5">
                            <div className="grid grid-cols-3 gap-3">
                              {categories.map((c) => (
                                <Link
                                  key={c.slug}
                                  href={`/products?category=${c.slug}`}
                                  className="group flex items-center gap-3 rounded-2xl p-2 hover:bg-muted transition-colors"
                                >
                                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-foreground">{c.emoji} {c.name}</div>
                                    <div className="text-xs text-muted-foreground">{c.productCount} produk</div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      scrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className={cn('grid place-items-center w-10 h-10 rounded-full transition-colors', scrolled ? 'hover:bg-muted' : 'hover:bg-white/10 text-white')}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setWishlistOpen(true)}
                aria-label="Wishlist"
                className={cn('relative grid place-items-center w-10 h-10 rounded-full transition-colors', scrolled ? 'hover:bg-muted' : 'hover:bg-white/10 text-white')}
              >
                <Heart className="w-5 h-5" />
                {mounted && wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-accent text-white text-[10px] font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCartOpen(true)}
                aria-label="Cart"
                className={cn('relative grid place-items-center w-10 h-10 rounded-full transition-colors', scrolled ? 'hover:bg-muted' : 'hover:bg-white/10 text-white')}
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && cartCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-primary text-white text-[10px] font-bold">
                    {cartCount()}
                  </span>
                )}
              </button>

              <div className="hidden sm:flex items-center gap-1 ml-1">
                <Button variant="ghost" size="sm" className={scrolled ? '' : 'text-white hover:bg-white/10'}>
                  <User className="w-4 h-4 mr-1" /> Login
                </Button>
                <Button size="sm" className="bg-brand-emerald hover:bg-emerald-700 text-white">
                  Register
                </Button>
              </div>

              <button
                onClick={() => setMobileNavOpen(true)}
                aria-label="Menu"
                className={cn('lg:hidden grid place-items-center w-10 h-10 rounded-full transition-colors', scrolled ? 'hover:bg-muted' : 'hover:bg-white/10 text-white')}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

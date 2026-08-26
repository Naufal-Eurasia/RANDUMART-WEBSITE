'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, User } from 'lucide-react';
import { navLinks } from '@/lib/categories';
import { useCategories } from '@/hooks/use-categories';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, wishlist, setSearchOpen, setCartOpen, setWishlistOpen, setMobileNavOpen } = useStore();
  const { categories } = useCategories();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setMounted(true), []);

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
          'sticky top-0 z-50 transition-all duration-500 backdrop-blur-xl',
          scrolled ? 'glass shadow-soft bg-background/95' : 'bg-background/95'
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image
                src="/logo.jpg"
                alt="Randumart"
                width={44}
                height={44}
                priority
                className="w-10 h-10 lg:w-11 lg:h-11 rounded-full object-cover"
              />
              <div className="hidden sm:block leading-none">
                <div className="font-display font-bold text-lg tracking-tight text-foreground">
                  <span className="text-brand-emerald">Randu</span>
                  <span className="text-brand-red">mart</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-brand-blue">
                  Herbal & Souvenir Umrah
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden xl:flex items-center">
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
                        'inline-flex items-center gap-1 whitespace-nowrap px-1.5 py-2 text-[13px] font-medium rounded-lg transition-colors',
                        'text-foreground hover:bg-muted'
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
                      'whitespace-nowrap px-1.5 py-2 text-[13px] font-medium rounded-lg transition-colors',
                      'text-foreground hover:bg-muted'
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
                className={cn('grid place-items-center w-10 h-10 rounded-full transition-colors', 'hover:bg-muted text-foreground')}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setWishlistOpen(true)}
                aria-label="Wishlist"
                className={cn('relative grid place-items-center w-10 h-10 rounded-full transition-colors', 'hover:bg-muted text-foreground')}
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
                className={cn('relative grid place-items-center w-10 h-10 rounded-full transition-colors', 'hover:bg-muted text-foreground')}
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && cartCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-primary text-white text-[10px] font-bold">
                    {cartCount()}
                  </span>
                )}
              </button>

              <div className="hidden sm:flex items-center gap-1 ml-1">
                {status === 'loading' ? (
                  <div className="w-[150px] h-9 rounded-md bg-muted/20 animate-pulse"></div>
                ) : status === 'authenticated' ? (
                  <Button size="sm" className="bg-brand-emerald hover:bg-emerald-700 text-white" asChild>
                    <Link href={session?.user?.role === 'ADMIN' ? '/admin' : '/account'}>
                      <User className="w-4 h-4 mr-1" /> Akun Saya
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted" asChild>
                      <Link href="/login">
                        <User className="w-4 h-4 mr-1" /> Login
                      </Link>
                    </Button>
                    <Button size="sm" className="bg-brand-emerald hover:bg-emerald-700 text-white" asChild>
                      <Link href="/register">
                        Register
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <button
                onClick={() => setMobileNavOpen(true)}
                aria-label="Menu"
                className={cn('xl:hidden grid place-items-center w-10 h-10 rounded-full transition-colors', 'hover:bg-muted text-foreground')}
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

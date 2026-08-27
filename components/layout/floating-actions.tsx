'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { ShoppingBag } from 'lucide-react';

export function FloatingActions() {
  const [show, setShow] = useState(false);
  const { setCartOpen, cartCount } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-40 flex flex-col gap-3">
      {/* WhatsApp */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="grid place-items-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-premium hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Floating cart (mobile) */}
      <button
        onClick={() => setCartOpen(true)}
        aria-label="Cart"
        className="lg:hidden grid place-items-center w-12 h-12 rounded-full bg-brand-green text-white shadow-premium hover:scale-110 transition-transform relative"
      >
        <ShoppingBag className="w-6 h-6" />
        {mounted && cartCount() > 0 && (
          <span className="absolute -top-1 -right-1 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-accent text-white text-[10px] font-bold">
            {cartCount()}
          </span>
        )}
      </button>

      {/* Back to top */}
      <AnimatePresence>
        {show && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="grid place-items-center w-12 h-12 rounded-full bg-white text-brand-green shadow-premium border border-border hover:bg-muted transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

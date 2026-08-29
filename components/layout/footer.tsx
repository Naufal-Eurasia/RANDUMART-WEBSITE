'use client';

import Link from 'next/link';
import { Instagram, Facebook, Youtube, Phone, MapPin, Send } from 'lucide-react';
import { useCategories } from '@/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

export function Footer() {
  const [email, setEmail] = useState('');
  const { categories } = useCategories();

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Berhasil berlangganan newsletter Randumart!');
    setEmail('');
  };

  return (
    <footer id="contact" className="bg-gradient-to-b from-brand-cream to-brand-beige border-t border-border pt-16 pb-28 lg:pb-12">
      {/* Newsletter */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-14">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-emerald to-emerald-800 p-8 sm:p-12 text-white">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 w-56 h-56 rounded-full bg-brand-gold/20 blur-2xl" />
          <div className="relative grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2">Dapatkan Penawaran Eksklusif</h3>
              <p className="text-white/80 max-w-md">Berlangganan newsletter kami untuk promo spesial, tips kesehatan, dan produk terbaru langsung ke inbox Anda.</p>
            </div>
            <form onSubmit={subscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/95 border-0 text-foreground h-12 rounded-full"
              />
              <Button type="submit" size="lg" className="bg-brand-gold hover:bg-amber-500 text-foreground rounded-full px-6 shrink-0">
                <Send className="w-4 h-4 mr-1" /> Langganan
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* About */}
        <div className="col-span-2 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-emerald to-emerald-700 text-white font-display font-bold text-lg">RM</div>
            <div className="leading-none">
              <div className="font-display font-bold text-lg text-brand-emerald">Randumart</div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Official Store</div>
            </div>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-sm">
            Randumart adalah toko resmi produk herbal, skincare, beauty, personal care, dan suplemen alami berkualitas untuk keluarga Indonesia.
          </p>
          <div className="flex gap-2">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="grid place-items-center w-10 h-10 rounded-full bg-white shadow-soft text-brand-emerald hover:bg-brand-emerald hover:text-white transition-colors">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-semibold mb-4 text-foreground">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link href="/products" className="hover:text-brand-emerald transition-colors">Semua Produk</Link></li>
            <li><Link href="/#ambassador" className="hover:text-brand-emerald transition-colors">Brand Ambassador</Link></li>
            <li><Link href="/#promo" className="hover:text-brand-emerald transition-colors">Promo</Link></li>
            <li><Link href="/#blog" className="hover:text-brand-emerald transition-colors">Artikel</Link></li>
            <li><Link href="/#about" className="hover:text-brand-emerald transition-colors">Tentang Kami</Link></li>
            <li><Link href="/#faq" className="hover:text-brand-emerald transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-display font-semibold mb-4 text-foreground">Kategori</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/products?category=${c.slug}`} className="hover:text-brand-emerald transition-colors">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-semibold mb-4 text-foreground">Customer Service</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="w-4 h-4 mt-0.5 text-brand-emerald shrink-0" />
              <span>+62 812 3456 7890 <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 ml-1">WhatsApp Only</span></span>
            </li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-brand-emerald shrink-0" /> Sidoarjo, Indonesia</li>
          </ul>
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">BPOM</span>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">HALAL MUI</span>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700">Official</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© 2024 Randumart. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-brand-emerald">Privacy Policy</Link>
          <Link href="#" className="hover:text-brand-emerald">Terms</Link>
          <Link href="#" className="hover:text-brand-emerald">Shipping</Link>
        </div>
      </div>
    </footer>
  );
}

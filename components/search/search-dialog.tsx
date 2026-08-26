'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { Search, TrendingUp, Clock, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { formatRupiah } from '@/lib/categories';

const popularKeywords = ['Habbatussauda', 'Vitamin C', 'Lipstick', 'Madu', 'Sunscreen', 'Serum'];

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [recent, setRecent] = useState<string[]>([]);

  const [results, setResults] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus & Load Recent + Trending
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      try {
        const r = JSON.parse(localStorage.getItem('sr12-recent-searches') || '[]');
        setRecent(r);
      } catch {}

      // Fetch trending (sekali saja)
      if (trending.length === 0) {
        fetch('/api/search?trending=true')
          .then(res => res.json())
          .then(data => setTrending(data))
          .catch(console.error);
      }
    } else {
      setQ('');
      setDebouncedQ('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOpen]);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(timer);
  }, [q]);

  // Fetch results based on debounced search
  useEffect(() => {
    if (!debouncedQ.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQ)}`)
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [debouncedQ]);

  const saveRecent = (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    localStorage.setItem('sr12-recent-searches', JSON.stringify(next));
  };

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl top-[15%] translate-y-0">
        <DialogTitle className="sr-only">Pencarian Produk</DialogTitle>
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && q.trim()) saveRecent(q.trim()); }}
            placeholder="Cari produk, kategori, atau brand..."
            className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
          />
          {q && (
            <button onClick={() => setQ('')} className="hover:text-foreground">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {q.trim() ? (
            isLoading ? (
              <div className="py-10 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Hasil Pencarian</p>
                {results.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} onClick={() => { saveRecent(q.trim()); setSearchOpen(false); }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="w-12 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                    <span className="text-sm font-bold text-brand-green">{formatRupiah(p.price)}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-muted-foreground">Tidak ada produk ditemukan untuk &quot;{q}&quot;</p>
              </div>
            )
          ) : (
            <div className="space-y-6">
              {recent.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Pencarian Terakhir</p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button key={r} onClick={() => setQ(r)} className="px-3 py-1.5 rounded-full bg-muted text-sm hover:bg-primary/10 hover:text-primary transition-colors">{r}</button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Pencarian Populer</p>
                <div className="flex flex-wrap gap-2">
                  {popularKeywords.map((k) => (
                    <button key={k} onClick={() => setQ(k)} className="px-3 py-1.5 rounded-full bg-muted text-sm hover:bg-primary/10 hover:text-primary transition-colors">{k}</button>
                  ))}
                </div>
              </div>
              {trending.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Produk Trending</p>
                  <div className="grid grid-cols-2 gap-2">
                    {trending.map((p) => (
                      <Link key={p.id} href={`/products/${p.slug}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-muted transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} className="w-10 h-12 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium line-clamp-1">{p.name}</p>
                          <p className="text-xs text-brand-green font-bold">{formatRupiah(p.price)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
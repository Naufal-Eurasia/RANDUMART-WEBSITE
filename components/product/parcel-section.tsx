'use client';

import { useEffect, useState } from 'react';
import { Gift, ShoppingBag } from 'lucide-react';
import { formatRupiah } from '@/lib/categories';
import { cn } from '@/lib/utils';

type BundleType = 'BUNDLING' | 'PARSEL';

interface BundleItem {
  id: string;
  quantity: number;
  product: { id: string; name: string };
}

interface Bundle {
  id: string;
  name: string;
  type: BundleType;
  imageUrl: string | null;
  description: string | null;
  price: number | string;
  details: string | null;
  isPreorder: boolean;
  preorderDays: number | null;
  items: BundleItem[];
}

function summarizeContents(bundle: Bundle): string {
  if (bundle.details) return bundle.details;
  if (bundle.items.length > 0) return bundle.items.map((i) => i.product.name).join(', ');
  return bundle.description || '-';
}

export function ParcelSection() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchBundles() {
      try {
        const res = await fetch('/api/bundles');
        if (res.ok && active) setBundles(await res.json());
      } catch {
        // Diam saja — section ini tidak boleh mengganggu halaman produk utama.
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchBundles();
    return () => { active = false; };
  }, []);

  // Belum ada paket dibuat admin, atau masih loading — jangan tampilkan section kosong.
  if (loading || bundles.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-5 h-5 text-brand-green" />
        <h2 className="font-display text-xl sm:text-2xl font-bold">Paket Parsel & Bundling</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {bundles.map((b) => {
          const isParsel = b.type === 'PARSEL';
          return (
            <div
              key={b.id}
              className="flex flex-col rounded-3xl bg-white border border-border/60 overflow-hidden shadow-soft"
            >
              <div className="relative aspect-[4/3] bg-muted">
                {b.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.imageUrl} alt={b.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center bg-brand-green/5">
                    {isParsel ? (
                      <Gift className="w-8 h-8 text-brand-green/40" />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-brand-green/40" />
                    )}
                  </div>
                )}
                <span
                  className={cn(
                    'absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-soft',
                    isParsel ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                  )}
                >
                  {isParsel ? (b.isPreorder ? `Pre-Order ${b.preorderDays ?? 14} Hari` : 'Parsel') : 'Bundling'}
                </span>
              </div>

              <div className="flex flex-col p-4 flex-1">
                <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2">{b.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  Isi: {summarizeContents(b)}
                </p>
                <span className="mt-auto pt-3 font-display font-bold text-base text-brand-green">
                  {formatRupiah(Number(b.price))}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

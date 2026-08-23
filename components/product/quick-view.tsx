'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Product } from '@/lib/types';
import { formatRupiah } from '@/lib/categories';
import { useStore } from '@/lib/store';
import { Star, Heart, ShoppingBag, ShieldCheck, BadgeCheck, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function QuickView({ product, open, onOpenChange }: { product: Product; open: boolean; onOpenChange: (v: boolean) => void }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_DESC_LENGTH = 150;
  const inWish = isInWishlist(product.id);

  const images = (product as any).images?.length
    ? (product as any).images
    : ((product as any).imageGallery?.length
        ? (product as any).imageGallery
        : [(product as any).image || '/placeholder.jpg']);

  const categoryLabel = (product as any).categoryName || (typeof product.category === 'string' ? product.category : (product.category as any)?.name) || 'Kategori';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid md:grid-cols-2">
          {/* Gallery */}
          <div className="relative bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[activeImg]?.url || images[activeImg]} alt={product.name} className="w-full h-full object-cover aspect-square md:aspect-auto" />
            {product.discount && (
              <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-bold">-{product.discount}%</span>
            )}
          </div>
          {/* Info */}
          <div className="p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviewCount} ulasan)</span>
              <span className="ml-auto text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{categoryLabel}</span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight">{product.name}</h2>

            <div className="mt-4 flex items-end gap-2">
              <span className="font-display text-2xl font-bold text-brand-emerald">{formatRupiah(product.price)}</span>
              {product.originalPrice && <span className="text-sm text-muted-foreground line-through">{formatRupiah(product.originalPrice)}</span>}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {product.bpom && <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-medium"><ShieldCheck className="w-3.5 h-3.5" /> {product.bpom}</span>}
              {product.halal && <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium"><BadgeCheck className="w-3.5 h-3.5" /> Halal MUI</span>}
            </div>

            {/* Description - single block with expand/collapse */}
            <div className="mt-4">
              <p className={cn('text-sm text-muted-foreground', !isExpanded && product.description?.length > MAX_DESC_LENGTH ? 'line-clamp-3' : '')}>
                {product.description}
              </p>
              {product.description?.length > MAX_DESC_LENGTH && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 text-sm font-semibold text-brand-emerald hover:underline focus:outline-none"
                >
                  {isExpanded ? 'Lihat lebih sedikit ↑' : 'Lihat selengkapnya ↓'}
                </button>
              )}
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-2">
              {images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn('w-14 h-14 rounded-xl overflow-hidden border-2 transition-colors', activeImg === i ? 'border-brand-emerald' : 'border-border')}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img?.url || img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Qty + actions */}
            <div className="mt-auto pt-6 flex items-center gap-3">
              <div className="flex items-center border border-border rounded-full">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid place-items-center w-10 h-10 hover:bg-muted rounded-l-full"><Minus className="w-4 h-4" /></button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="grid place-items-center w-10 h-10 hover:bg-muted rounded-r-full"><Plus className="w-4 h-4" /></button>
              </div>
              <button
                onClick={() => { toggleWishlist(product.id); toast.success(inWish ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist'); }}
                className="grid place-items-center w-11 h-11 rounded-full border border-border hover:bg-muted"
              >
                <Heart className={cn('w-5 h-5', inWish ? 'fill-accent text-accent' : '')} />
              </button>
              <button
                onClick={() => { addToCart(product, qty); toast.success('Ditambahkan ke keranjang'); onOpenChange(false); }}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-full bg-brand-emerald text-white font-semibold hover:bg-emerald-700 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
            </div>
            <Link href={`/products/${product.slug}`} onClick={() => onOpenChange(false)} className="mt-2 text-center text-sm font-medium text-brand-emerald hover:underline">
              Lihat detail produk →
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

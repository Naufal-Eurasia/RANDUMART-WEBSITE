'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag, Eye, Plus } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { formatRupiah } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { QuickView } from './quick-view';

const badgeStyles: Record<string, string> = {
  'best-seller': 'bg-amber-500 text-white',
  'new-arrival': 'bg-emerald-600 text-white',
  'limited': 'bg-fuchsia-600 text-white',
  'official': 'bg-blue-600 text-white',
  'bpom': 'bg-teal-600 text-white',
  'halal': 'bg-green-600 text-white',
  'out-of-stock': 'bg-gray-500 text-white',
};

const badgeLabels: Record<string, string> = {
  'best-seller': 'Best Seller',
  'new-arrival': 'New',
  'limited': 'Limited',
  'official': 'Official',
  'bpom': 'BPOM',
  'halal': 'Halal',
  'out-of-stock': 'Stok Habis',
};

function ProductCardImpl({ product, index = 0, imageSrc }: { product: Product; index?: number; imageSrc?: string }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [quickOpen, setQuickOpen] = useState(false);
  const inWish = isInWishlist(product.id);
  const outOfStock = product.stock === 0;
  const displayImage = imageSrc || product.image;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
        className="group relative flex flex-col rounded-3xl bg-white border border-border/60 overflow-hidden shadow-soft hover:shadow-premium transition-shadow"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <Link href={`/products/${product.slug}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.discount && (
              <span className="px-2 py-1 rounded-full bg-accent text-white text-[10px] font-bold shadow-soft">
                -{product.discount}%
              </span>
            )}
            {product.badges.slice(0, 2).map((b) => (
              <span key={b} className={cn('px-2 py-1 rounded-full text-[10px] font-bold shadow-soft', badgeStyles[b])}>
                {badgeLabels[b]}
              </span>
            ))}
          </div>

          {/* Wishlist */}
          <button
            onClick={() => {
              toggleWishlist(product.id);
              toast.success(inWish ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist');
            }}
            aria-label="Toggle wishlist"
            className="absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-full glass shadow-soft hover:scale-110 transition-transform"
          >
            <Heart className={cn('w-4 h-4', inWish ? 'fill-accent text-accent' : 'text-foreground')} />
          </button>

          {/* Quick actions */}
          <div className="absolute bottom-3 inset-x-3 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={() => setQuickOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full glass shadow-soft text-sm font-semibold hover:bg-white transition-colors"
            >
              <Eye className="w-4 h-4" /> Quick View
            </button>
            <button
              onClick={() => {
                if (outOfStock) return;
                addToCart(product);
                toast.success(`${product.name} ditambahkan ke keranjang`);
              }}
              disabled={outOfStock}
              aria-label="Add to cart"
              className="grid place-items-center w-11 h-11 rounded-full bg-brand-emerald text-white shadow-soft hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {outOfStock && (
            <div className="absolute inset-0 bg-white/60 grid place-items-center">
              <span className="px-4 py-2 rounded-full bg-foreground/80 text-white text-sm font-semibold">Stok Habis</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col p-4 flex-1">
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            <span className="ml-auto text-xs text-muted-foreground">{product.category}</span>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2 hover:text-brand-emerald transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{product.shortDescription}</p>

          <div className="mt-3 flex items-end gap-2">
            <span className="font-display font-bold text-base text-brand-emerald">{formatRupiah(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatRupiah(product.originalPrice)}</span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className={cn('inline-block w-2 h-2 rounded-full', outOfStock ? 'bg-gray-400' : 'bg-emerald-500')} />
            <span className={outOfStock ? 'text-muted-foreground' : 'text-emerald-600 font-medium'}>
              {outOfStock ? 'Stok habis' : `Stok ${product.stock}`}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (outOfStock) return;
                addToCart(product);
                toast.success('Ditambahkan ke keranjang');
              }}
              disabled={outOfStock}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-full border border-border text-xs font-semibold hover:bg-muted transition-colors disabled:opacity-50"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Cart
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="flex items-center justify-center py-2.5 rounded-full bg-brand-emerald text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </motion.div>

      <QuickView product={product} open={quickOpen} onOpenChange={setQuickOpen} />
    </>
  );
}

const ProductCard = React.memo(ProductCardImpl, (prev, next) => prev.product.id === next.product.id && prev.index === next.index);
ProductCard.displayName = 'ProductCard';

export { ProductCard };

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Minus, Plus, ShieldCheck, BadgeCheck, Truck, ChevronRight, ZoomIn, Check } from 'lucide-react';
import { formatRupiah } from '@/lib/categories';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProductDetailClient({ product, related }: { product: any, related: any[] }) {
  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed } = useStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      setActiveImg(0);
      setQty(1);
    }
  }, [product, product?.id, addRecentlyViewed]);

  const inWish = isInWishlist(product.id);
  const images = product.imageGallery.length > 0 ? product.imageGallery : ['/placeholder.jpg'];

  return (
    <div className="pt-24 lg:pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-primary">Home</Link><ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-primary">Products</Link><ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/products?category=${product.categorySlug}`} className="hover:text-primary">{product.categoryName}</Link><ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="lg:sticky lg:top-28 lg:self-start space-y-3">
          <div
            className="relative aspect-square rounded-3xl overflow-hidden bg-muted group cursor-zoom-in"
            onClick={() => setZoom(!zoom)}
          >
            <Image src={images[activeImg]} alt={product.name || "Product Image"} fill quality={90} className={cn('object-contain bg-[#FBF8F2] transition-transform duration-500', zoom ? 'scale-150' : 'group-hover:scale-110')} />
            <button className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full glass shadow-soft"><ZoomIn className="w-5 h-5" /></button>
            {product.discount > 0 && <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-bold">-{product.discount}%</span>}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((img: string, i: number) => (
                <button key={i} onClick={() => setActiveImg(i)} className={cn('relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-colors', activeImg === i ? 'border-brand-green' : 'border-border')}>
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-contain bg-[#FBF8F2]" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            {product.tags?.map((b: string) => (
              <span key={b} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold capitalize">{b.replace('-', ' ')}</span>
            ))}
          </div>

          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground text-sm">({product.reviewCount} ulasan)</span>
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <span className="text-sm font-medium text-brand-green">Terjual {product.reviewCount * 3}+</span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <span className="font-display text-3xl font-bold text-brand-green">{formatRupiah(product.price)}</span>
            {product.originalPrice && <span className="text-lg text-muted-foreground line-through mb-1">{formatRupiah(product.originalPrice)}</span>}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-y border-border/60">
            <div className="flex items-center gap-3"><div className="grid place-items-center w-10 h-10 rounded-full bg-primary/10 text-primary"><ShieldCheck className="w-5 h-5" /></div><span className="text-sm font-medium">Garansi 100% Original</span></div>
            <div className="flex items-center gap-3"><div className="grid place-items-center w-10 h-10 rounded-full bg-primary/10 text-primary"><BadgeCheck className="w-5 h-5" /></div><span className="text-sm font-medium">BPOM Certified</span></div>
            <div className="flex items-center gap-3"><div className="grid place-items-center w-10 h-10 rounded-full bg-primary/10 text-primary"><Truck className="w-5 h-5" /></div><span className="text-sm font-medium">Pengiriman Aman</span></div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Kuantitas</span>
              {product.stock > 0 ? (
                <div className="flex items-center gap-4 bg-muted p-1 rounded-full">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid place-items-center w-8 h-8 rounded-full bg-white shadow-soft"><Minus className="w-4 h-4" /></button>
                  <span className="w-4 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="grid place-items-center w-8 h-8 rounded-full bg-white shadow-soft"><Plus className="w-4 h-4" /></button>
                </div>
              ) : (
                <span className="text-sm text-destructive font-semibold">Stok Habis</span>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 rounded-full h-12 text-base font-semibold"
                disabled={product.stock === 0}
                onClick={() => {
                  addToCart(product, qty);
                  toast.success(`Ditambahkan ke keranjang`, { description: `${qty}x ${product.name}` });
                }}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {product.stock > 0 ? 'Masukkan Keranjang' : 'Stok Habis'}
              </Button>
              <Button
                size="icon"
                variant="outline"
                className={cn("rounded-full h-12 w-12 shrink-0 transition-colors", inWish && "text-destructive border-destructive bg-destructive/10")}
                onClick={() => {
                  toggleWishlist(product.id);
                  toast.success(inWish ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist');
                }}
              >
                <Heart className={cn("w-5 h-5", inWish && "fill-destructive")} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="font-display text-2xl font-bold mb-6">Produk Terkait</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Minus, Plus, ShieldCheck, BadgeCheck, Truck, RotateCcw, ChevronLeft, ChevronRight, ZoomIn, Check } from 'lucide-react';
import { getProductBySlug, getRelatedProducts, products } from '@/lib/products';
import { formatRupiah } from '@/lib/categories';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const product = getProductBySlug(slug as string);
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
  }, [product, addRecentlyViewed]);

  if (!product) return notFound();

  const related = getRelatedProducts(product, 4);
  const recent = products.filter((p) => useStore.getState().recentlyViewed.includes(p.id) && p.id !== product.id).slice(0, 4);
  const inWish = isInWishlist(product.id);

  return (
    <div className="pt-24 lg:pt-28 pb-20">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <button type="button" onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-medium text-brand-emerald hover:text-emerald-700 mb-4">
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
        <nav className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-primary">Home</Link><ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-primary">Products</Link><ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/products?category=${product.categorySlug}`} className="hover:text-primary">{product.category}</Link><ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start space-y-3">
          <div
            className="relative aspect-square rounded-3xl overflow-hidden bg-muted group cursor-zoom-in"
            onClick={() => setZoom(!zoom)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.images[activeImg]} alt={product.name} className={cn('w-full h-full object-cover transition-transform duration-500', zoom ? 'scale-150' : 'group-hover:scale-110')} />
            <button className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full glass shadow-soft"><ZoomIn className="w-5 h-5" /></button>
            {product.discount && <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-bold">-{product.discount}%</span>}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={cn('shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-colors', activeImg === i ? 'border-brand-emerald' : 'border-border')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            {product.badges.map((b) => (
              <span key={b} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold capitalize">{b.replace('-', ' ')}</span>
            ))}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">{product.name}</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn('w-4 h-4', i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground')} />)}
            </div>
            <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">{product.reviewCount} ulasan</span>
          </div>

          <div className="flex items-end gap-3">
            <span className="font-display text-3xl font-bold text-brand-emerald">{formatRupiah(product.price)}</span>
            {product.originalPrice && <span className="text-base text-muted-foreground line-through">{formatRupiah(product.originalPrice)}</span>}
            {product.discount && <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold">Hemat {product.discount}%</span>}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Certifications */}
          <div className="flex flex-wrap gap-2">
            {product.bpom && <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 font-medium"><ShieldCheck className="w-4 h-4" /> {product.bpom}</span>}
            {product.halal && <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-medium"><BadgeCheck className="w-4 h-4" /> Halal MUI</span>}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 text-sm">
            <span className={cn('inline-block w-2.5 h-2.5 rounded-full', product.stock > 0 ? 'bg-emerald-500' : 'bg-gray-400')} />
            <span className={product.stock > 0 ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}>
              {product.stock > 0 ? `Stok tersedia (${product.stock})` : 'Stok habis'}
            </span>
          </div>

          {/* Qty + actions */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border border-border rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid place-items-center w-11 h-11 hover:bg-muted rounded-l-full"><Minus className="w-4 h-4" /></button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="grid place-items-center w-11 h-11 hover:bg-muted rounded-r-full"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={() => { toggleWishlist(product.id); toast.success(inWish ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist'); }} className="grid place-items-center w-12 h-12 rounded-full border border-border hover:bg-muted">
              <Heart className={cn('w-5 h-5', inWish ? 'fill-accent text-accent' : '')} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => { addToCart(product, qty); toast.success('Ditambahkan ke keranjang'); }} disabled={product.stock === 0} className="h-12 rounded-full border border-brand-emerald text-brand-emerald bg-white hover:bg-muted">
              <ShoppingBag className="w-4 h-4 mr-1.5" /> Add to Cart
            </Button>
            <Button onClick={() => { addToCart(product, qty); toast.success('Lanjut ke checkout'); }} disabled={product.stock === 0} className="h-12 rounded-full bg-brand-emerald hover:bg-emerald-700 text-white">
              Buy Now
            </Button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { icon: Truck, title: 'Gratis Ongkir', desc: 'Min. Rp150K' },
              { icon: RotateCcw, title: 'Mudah Retur', desc: '7 hari' },
              { icon: ShieldCheck, title: 'Produk Asli', desc: '100% Original' },
            ].map((t, i) => (
              <div key={i} className="text-center p-3 rounded-2xl bg-muted/60">
                <t.icon className="w-6 h-6 mx-auto text-brand-emerald mb-1.5" />
                <p className="text-xs font-semibold">{t.title}</p>
                <p className="text-[10px] text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Details accordion */}
          <Accordion type="single" collapsible className="pt-2">
            <AccordionItem value="benefits" className="rounded-2xl bg-white border border-border/60 px-5">
              <AccordionTrigger className="font-display font-semibold hover:no-underline">Manfaat</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="w-4 h-4 text-brand-emerald mt-0.5 shrink-0" /> {b}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ingredients" className="rounded-2xl bg-white border border-border/60 px-5">
              <AccordionTrigger className="font-display font-semibold hover:no-underline">Komposisi</AccordionTrigger>
              <AccordionContent><p className="text-sm text-muted-foreground">{product.ingredients}</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="usage" className="rounded-2xl bg-white border border-border/60 px-5">
              <AccordionTrigger className="font-display font-semibold hover:no-underline">Cara Pakai</AccordionTrigger>
              <AccordionContent><p className="text-sm text-muted-foreground">{product.usage}</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="warning" className="rounded-2xl bg-white border border-border/60 px-5">
              <AccordionTrigger className="font-display font-semibold hover:no-underline">Peringatan</AccordionTrigger>
              <AccordionContent><p className="text-sm text-muted-foreground">Simpan di tempat sejuk dan kering, terhindar dari sinar matahari langsung. Jauhkan dari jangkauan anak-anak. Hentikan penggunaan jika terjadi iritasi. Tidak untuk pengobatan medis.</p></AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="font-display text-2xl font-bold mb-6">Ulasan Pelanggan</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {product.reviews.map((r) => (
            <div key={r.id} className="rounded-3xl bg-white border border-border/60 p-5 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm">{r.name}</p>
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn('w-3 h-3', i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground')} />)}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(r.date).toLocaleDateString('id-ID')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="font-display text-2xl font-bold mb-6">Produk Terkait</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* Recently viewed */}
      {recent.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="font-display text-2xl font-bold mb-6">Baru Saja Dilihat</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {recent.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* Sticky buy bar (mobile) */}
      <div className="lg:hidden fixed bottom-16 inset-x-0 z-30 glass border-t border-border p-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground line-clamp-1">{product.name}</p>
          <p className="font-display font-bold text-brand-emerald">{formatRupiah(product.price)}</p>
        </div>
        <Button onClick={() => { addToCart(product, qty); toast.success('Ditambahkan ke keranjang'); }} disabled={product.stock === 0} size="sm" className="rounded-full border border-brand-emerald text-brand-emerald bg-white hover:bg-muted">
          <ShoppingBag className="w-4 h-4" />
        </Button>
        <Button onClick={() => { addToCart(product, qty); }} disabled={product.stock === 0} size="sm" className="rounded-full bg-brand-emerald hover:bg-emerald-700 px-5">
          Buy Now
        </Button>
      </div>
    </div>
  );
}

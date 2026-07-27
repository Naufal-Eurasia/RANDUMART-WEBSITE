'use client';

import { useMemo, useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, LayoutGrid, List, Star } from 'lucide-react';
import { categories } from '@/lib/categories';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { formatRupiah } from '@/lib/categories';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Harga Terendah' },
  { value: 'price-desc', label: 'Harga Tertinggi' },
  { value: 'rating', label: 'Rating Tertinggi' },
  { value: 'discount', label: 'Diskon Terbesar' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialConcern = searchParams.get('concern');

  const [category, setCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState<number[]>([0, 500000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [bestSellerOnly, setBestSellerOnly] = useState(false);
  const [sort, setSort] = useState('popular');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const perPage = 12;

  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((p: any) => ({
             ...p,
             price: Number(p.price),
             originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
             categorySlug: p.category?.slug,
             categoryName: p.category?.name,
             image: p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url || '',
             shortDescription: p.description
          }));
          setDbProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let list = [...dbProducts];
    if (category !== 'all') list = list.filter((p) => p.categorySlug === category);
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (inStockOnly) list = list.filter((p) => p.stock > 0);
    if (bestSellerOnly) list = list.filter((p) => p.isBestSeller);
    if (initialConcern) list = list.filter((p) => p.tags && p.tags.includes(initialConcern));

    switch (sort) {
      case 'newest': list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew)); break;
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'discount': list.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break;
      default: list.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return list;
  }, [dbProducts, category, priceRange, minRating, inStockOnly, bestSellerOnly, sort, initialConcern]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const activeCat = categories.find((c) => c.slug === category);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-display font-semibold text-sm mb-3">Kategori</h4>
        <div className="space-y-2">
          <button
            onClick={() => { setCategory('all'); setPage(1); }}
            className={cn('block w-full text-left px-3 py-2 rounded-xl text-sm transition-colors', category === 'all' ? 'bg-primary text-white font-semibold' : 'hover:bg-muted')}
          >
            Semua Kategori
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => { setCategory(c.slug); setPage(1); }}
              className={cn('flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-sm transition-colors', category === c.slug ? 'bg-primary text-white font-semibold' : 'hover:bg-muted')}
            >
              <span>{c.emoji} {c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-display font-semibold text-sm mb-3">Rentang Harga</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={500000}
          step={10000}
          className="my-4"
        />
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{formatRupiah(priceRange[0])}</span>
          <span className="font-medium">{formatRupiah(priceRange[1])}</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-display font-semibold text-sm mb-3">Rating Minimum</h4>
        <div className="space-y-2">
          {[0, 4, 4.5].map((r) => (
            <button key={r} onClick={() => setMinRating(r)} className={cn('flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-colors', minRating === r ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted')}>
              {r === 0 ? 'Semua Rating' : <><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {r}+ </>}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-display font-semibold text-sm mb-3">Ketersediaan</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(!!v)} />
            <span className="text-sm">Stok Tersedia</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={bestSellerOnly} onCheckedChange={(v) => setBestSellerOnly(!!v)} />
            <span className="text-sm">Best Seller</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 lg:pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="text-sm text-muted-foreground mb-3 flex items-center gap-1.5">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          {activeCat && <><span>/</span><span className="text-foreground font-medium">{activeCat.name}</span></>}
        </nav>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              {activeCat ? `${activeCat.emoji} ${activeCat.name}` : 'Semua Produk'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{loading ? 'Memuat produk...' : `${filtered.length} produk ditemukan`}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-44 rounded-full"><SelectValue placeholder="Urutkan" /></SelectTrigger>
              <SelectContent>{sortOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-muted">
              <button onClick={() => setView('grid')} className={cn('grid place-items-center w-9 h-9 rounded-full', view === 'grid' ? 'bg-white shadow-soft' : '')}><LayoutGrid className="w-4 h-4" /></button>
              <button onClick={() => setView('list')} className={cn('grid place-items-center w-9 h-9 rounded-full', view === 'list' ? 'bg-white shadow-soft' : '')}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-3xl bg-white border border-border/60 p-6 shadow-soft">
            <FilterContent />
          </div>
        </aside>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="rounded-full"><SlidersHorizontal className="w-4 h-4 mr-1" /> Filter</Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto p-6">
              <FilterContent />
            </SheetContent>
          </Sheet>
        </div>

        <div>
          {loading ? (
             <div className="py-20 text-center">
               <h3 className="font-display font-semibold text-lg">Memuat Produk...</h3>
             </div>
          ) : paged.length === 0 ? (
            <div className="py-20 text-center">
              <div className="grid place-items-center w-20 h-20 rounded-full bg-muted mx-auto mb-4"><X className="w-9 h-9 text-muted-foreground" /></div>
              <h3 className="font-display font-semibold text-lg">Tidak ada produk</h3>
              <p className="text-sm text-muted-foreground mt-1">Coba ubah filter pencarian Anda.</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {paged.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          ) : (
            <div className="space-y-4">
              {paged.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} className="flex gap-4 rounded-3xl bg-white border border-border/60 p-3 shadow-soft hover:shadow-premium transition-shadow">
                  <Link href={`/products/${p.slug}`} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="w-28 h-36 sm:w-36 sm:h-44 rounded-2xl object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-0.5"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /><span className="text-xs font-semibold">{p.rating.toFixed(1)}</span></div>
                      <span className="text-xs text-muted-foreground">({p.reviewCount})</span>
                      <span className="ml-auto text-xs text-muted-foreground">{p.categoryName}</span>
                    </div>
                    <Link href={`/products/${p.slug}`}><h3 className="font-display font-semibold hover:text-primary line-clamp-1">{p.name}</h3></Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.shortDescription}</p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="font-display font-bold text-brand-emerald">{formatRupiah(p.price)}</span>
                      {p.originalPrice && <span className="text-xs text-muted-foreground line-through">{formatRupiah(p.originalPrice)}</span>}
                    </div>
                    <div className="mt-auto pt-3 flex gap-2">
                      <Link href={`/products/${p.slug}`} className="flex-1 text-center py-2 rounded-full bg-brand-emerald text-white text-sm font-semibold">Buy Now</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={cn('grid place-items-center w-10 h-10 rounded-full text-sm font-semibold transition-colors', page === i + 1 ? 'bg-brand-emerald text-white' : 'bg-muted hover:bg-primary/10')}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() { return <Suspense fallback={<div>Loading...</div>}><ProductsContent /></Suspense>; }
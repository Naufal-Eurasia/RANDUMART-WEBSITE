'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useStore } from '@/lib/store';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/categories';
import { toast } from 'sonner';

export function WishlistDrawer() {
  const { wishlistOpen, setWishlistOpen, wishlist, toggleWishlist, addToCart } = useStore();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadWishlist() {
      if (!wishlistOpen || wishlist.length === 0) {
        if (wishlist.length === 0) setItems([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          const mapped = data
            .filter((p: any) => wishlist.includes(p.id))
            .map((p: any) => ({
             ...p,
             price: Number(p.price),
             originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
             categorySlug: p.category?.slug,
             categoryName: p.category?.name,
             image: p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url || '/placeholder.jpg',
             shortDescription: p.description
          }));
          setItems(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, [wishlistOpen, wishlist]);

  return (
    <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-5 border-b border-border">
          <SheetTitle className="flex items-center gap-2 font-display">
            <Heart className="w-5 h-5 text-accent" />
            Wishlist ({wishlist.length})
          </SheetTitle>
        </SheetHeader>

        {wishlist.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid place-items-center w-24 h-24 rounded-full bg-muted">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg">Wishlist Kosong</h3>
              <p className="text-sm text-muted-foreground mt-1">Simpan produk favorit Anda di sini.</p>
            </div>
            <Button onClick={() => setWishlistOpen(false)} className="bg-brand-green hover:bg-brand-greenHover rounded-full">
              Jelajahi Produk
            </Button>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
             Memuat data...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.map((p) => (
              <div key={p.id} className="flex gap-3">
                <Link href={`/products/${p.slug}`} onClick={() => setWishlistOpen(false)} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className="w-20 h-24 rounded-xl object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${p.slug}`} onClick={() => setWishlistOpen(false)}>
                    <h4 className="font-medium text-sm line-clamp-2 hover:text-brand-green">{p.name}</h4>
                  </Link>
                  <p className="text-sm font-bold text-brand-green mt-1">{formatRupiah(p.price)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => { addToCart(p); toast.success('Ditambahkan ke keranjang'); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-green text-white text-xs font-semibold hover:bg-brand-greenHover">
                      <ShoppingBag className="w-3.5 h-3.5" /> Add
                    </button>
                    <button onClick={() => { toggleWishlist(p.id); toast.success('Dihapus dari wishlist'); }} className="grid place-items-center w-8 h-8 rounded-full hover:bg-red-50 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

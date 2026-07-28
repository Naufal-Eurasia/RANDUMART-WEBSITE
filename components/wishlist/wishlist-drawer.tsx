'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useStore } from '@/lib/store';
import { products } from '@/lib/products';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/categories';
import { toast } from 'sonner';

export function WishlistDrawer() {
  const router = useRouter();
  const { wishlistOpen, setWishlistOpen, wishlist, toggleWishlist, addToCart } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  const handleBrowseProducts = () => {
    setWishlistOpen(false);
    router.push('/products');
  };

  return (
    <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-5 border-b border-border">
          <SheetTitle className="flex items-center gap-2 font-display">
            <Heart className="w-5 h-5 text-accent" />
            Wishlist ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid place-items-center w-24 h-24 rounded-full bg-muted">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg">Wishlist Kosong</h3>
              <p className="text-sm text-muted-foreground mt-1">Simpan produk favorit Anda di sini.</p>
            </div>
            <Button onClick={handleBrowseProducts} className="bg-brand-emerald hover:bg-emerald-700 rounded-full">
              Jelajahi Produk
            </Button>
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
                    <h4 className="font-medium text-sm line-clamp-2 hover:text-brand-emerald">{p.name}</h4>
                  </Link>
                  <p className="text-sm font-bold text-brand-emerald mt-1">{formatRupiah(p.price)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => { addToCart(p); toast.success('Ditambahkan ke keranjang'); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-emerald text-white text-xs font-semibold hover:bg-emerald-700">
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

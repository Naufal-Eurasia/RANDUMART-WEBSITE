'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useStore } from '@/lib/store';
import { products } from '@/lib/products';
import { formatRupiah } from '@/lib/categories';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, removeFromCart, updateQty, cartTotal, clearCart } = useStore();

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-5 border-b border-border">
          <SheetTitle className="flex items-center gap-2 font-display">
            <ShoppingBag className="w-5 h-5 text-brand-emerald" />
            Keranjang Belanja ({cart.length})
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid place-items-center w-24 h-24 rounded-full bg-muted">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg">Keranjang Kosong</h3>
              <p className="text-sm text-muted-foreground mt-1">Belum ada produk di keranjang Anda.</p>
            </div>
            <Button onClick={() => setCartOpen(false)} className="bg-brand-emerald hover:bg-emerald-700 rounded-full">
              Mulai Belanja
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <Link href={`/products/${item.product.slug}`} onClick={() => setCartOpen(false)} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.product.images?.[0]?.url || '/placeholder.jpg'} alt={item.product.name} className="w-20 h-24 rounded-xl object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.slug}`} onClick={() => setCartOpen(false)}>
                      <h4 className="font-medium text-sm line-clamp-2 hover:text-brand-emerald">{item.product.name}</h4>
                    </Link>
                    <p className="text-sm font-bold text-brand-emerald mt-1">{formatRupiah(item.product.price)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-full">
                        <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="grid place-items-center w-8 h-8 hover:bg-muted rounded-l-full"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="grid place-items-center w-8 h-8 hover:bg-muted rounded-r-full"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <button onClick={() => { removeFromCart(item.product.id); toast.success('Produk dihapus'); }} className="grid place-items-center w-8 h-8 rounded-full hover:bg-red-50 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => { clearCart(); toast.success('Keranjang dikosongkan'); }} className="text-xs text-muted-foreground hover:text-red-500">Kosongkan keranjang</button>
            </div>

            <div className="p-5 border-t border-border space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display font-bold text-lg text-brand-emerald">{formatRupiah(cartTotal())}</span>
              </div>
              <p className="text-xs text-muted-foreground">Ongkir dihitung saat checkout.</p>
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="block">
                <Button className="w-full h-12 rounded-full bg-brand-emerald hover:bg-emerald-700 text-white">
                  Checkout <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
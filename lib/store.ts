'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from './types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  cartOpen: boolean;
  wishlistOpen: boolean;
  searchOpen: boolean;
  mobileNavOpen: boolean;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  addRecentlyViewed: (id: string) => void;
  setCartOpen: (v: boolean) => void;
  setWishlistOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setMobileNavOpen: (v: boolean) => void;
  cartCount: () => number;
  cartTotal: () => number;

  // Sync Actions
  setCart: (items: CartItem[]) => void;
  setWishlist: (items: string[]) => void;
  syncWithServer: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      recentlyViewed: [],
      cartOpen: false,
      wishlistOpen: false,
      searchOpen: false,
      mobileNavOpen: false,
      addToCart: async (product, qty = 1) => {
        set((s) => {
          const existing = s.cart.find((c) => c.product.id === product.id);
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.product.id === product.id
                  ? { ...c, quantity: c.quantity + qty }
                  : c
              ),
              cartOpen: true,
            };
          }
          return { cart: [...s.cart, { product, quantity: qty }], cartOpen: true };
        });

        // Fire & Forget to API (optimistic update)
        try {
          const newQty = get().cart.find(c => c.product.id === product.id)?.quantity || qty;
          await fetch('/api/cart', {
            method: 'POST',
            body: JSON.stringify({ productId: product.id, quantity: newQty }),
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (e) {
          // Ignore, likely guest / offline
        }
      },
      removeFromCart: async (id) => {
        set((s) => ({ cart: s.cart.filter((c) => c.product.id !== id) }));

        try {
          await fetch(`/api/cart?productId=${id}`, { method: 'DELETE' });
        } catch (e) {}
      },
      updateQty: async (id, qty) => {
        const finalQty = Math.max(1, qty);
        set((s) => ({
          cart: s.cart.map((c) =>
            c.product.id === id ? { ...c, quantity: finalQty } : c
          ),
        }));

        try {
          await fetch('/api/cart', {
            method: 'POST',
            body: JSON.stringify({ productId: id, quantity: finalQty }),
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (e) {}
      },
      clearCart: async () => {
        set({ cart: [] });
        try {
          await fetch('/api/cart', { method: 'DELETE' });
        } catch (e) {}
      },
      toggleWishlist: async (id) => {
        const isAdding = !get().wishlist.includes(id);
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((w) => w !== id)
            : [...s.wishlist, id],
        }));

        try {
          if (isAdding) {
            await fetch('/api/wishlist', {
              method: 'POST',
              body: JSON.stringify({ productId: id }),
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            await fetch(`/api/wishlist?productId=${id}`, { method: 'DELETE' });
          }
        } catch (e) {}
      },
      isInWishlist: (id) => get().wishlist.includes(id),
      addRecentlyViewed: (id) =>
        set((s) => ({
          recentlyViewed: [
            id,
            ...s.recentlyViewed.filter((r) => r !== id),
          ].slice(0, 8),
        })),
      setCartOpen: (v) => set({ cartOpen: v }),
      setWishlistOpen: (v) => set({ wishlistOpen: v }),
      setSearchOpen: (v) => set({ searchOpen: v }),
      setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
      cartCount: () => get().cart.reduce((n, c) => n + c.quantity, 0),
      cartTotal: () =>
        get().cart.reduce((n, c) => n + c.product.price * c.quantity, 0),

      setCart: (items) => set({ cart: items }),
      setWishlist: (items) => set({ wishlist: items }),
      syncWithServer: async () => {
        try {
          // 1. Sync Cart (Merge)
          const currentCart = get().cart;
          const cartRes = await fetch('/api/cart/sync', {
            method: 'POST',
            body: JSON.stringify({ localCart: currentCart.map(c => ({ productId: c.product.id, quantity: c.quantity })) }),
            headers: { 'Content-Type': 'application/json' }
          });

          if (cartRes.ok) {
            const mergedCartDb = await cartRes.json();
            // Convert from DB format to Store format
            const formattedCart: CartItem[] = mergedCartDb.map((dbItem: any) => ({
              product: dbItem.product,
              quantity: dbItem.quantity
            }));
            set({ cart: formattedCart });
          }

          // 2. Sync Wishlist (GET only, wishlist merge is simple)
          const wlRes = await fetch('/api/wishlist');
          if (wlRes.ok) {
            const dbWishlist = await wlRes.json();
            const serverWlIds = dbWishlist.map((w: any) => w.productId);

            // Merge local IDs with server IDs (Unique)
            const localWlIds = get().wishlist;
            const mergedWlIds = Array.from(new Set([...serverWlIds, ...localWlIds]));

            // Upload any missing local items to server
            const missingOnServer = localWlIds.filter(id => !serverWlIds.includes(id));
            for (const id of missingOnServer) {
              await fetch('/api/wishlist', {
                method: 'POST',
                body: JSON.stringify({ productId: id }),
                headers: { 'Content-Type': 'application/json' }
              });
            }

            set({ wishlist: mergedWlIds });
          }
        } catch (e) {
          console.error("Sync error:", e);
        }
      }
    }),
    {
      name: 'sr12-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        cart: s.cart,
        wishlist: s.wishlist,
        recentlyViewed: s.recentlyViewed,
      }),
      version: 1,
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          return { ...persistedState, cart: [], wishlist: [], recentlyViewed: [] };
        }
        return persistedState;
      },
    }
  )
);

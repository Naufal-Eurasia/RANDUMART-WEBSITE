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
      addToCart: (product, qty = 1) =>
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
        }),
      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((c) => c.product.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          cart: s.cart.map((c) =>
            c.product.id === id ? { ...c, quantity: Math.max(1, qty) } : c
          ),
        })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((w) => w !== id)
            : [...s.wishlist, id],
        })),
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

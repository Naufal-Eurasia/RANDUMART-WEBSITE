'use client';

import dynamic from 'next/dynamic';

// Cart Drawer tertutup secara default dan cuma dipakai lewat interaksi
// (klik ikon keranjang), jadi tidak perlu ikut SSR maupun bundle JS awal.
export const CartDrawer = dynamic(() => import('./cart-drawer').then((mod) => mod.CartDrawer), {
  ssr: false,
});

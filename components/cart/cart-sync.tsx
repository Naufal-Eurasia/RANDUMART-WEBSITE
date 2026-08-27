'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useStore } from '@/lib/store';

export function CartSync() {
  const { status } = useSession();
  const syncWithServer = useStore((state) => state.syncWithServer);
  const clearCart = useStore((state) => state.clearCart);
  const hasSynced = useRef(false);
  const prevStatus = useRef(status);

  useEffect(() => {
    if (status === 'authenticated' && !hasSynced.current) {
      hasSynced.current = true;
      syncWithServer();
    }

    // Clear cart on logout
    if (prevStatus.current === 'authenticated' && status === 'unauthenticated') {
      clearCart();
      useStore.setState({ wishlist: [] });
      hasSynced.current = false;
    }

    prevStatus.current = status;
  }, [status, syncWithServer, clearCart]);

  return null;
}
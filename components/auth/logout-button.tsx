'use client';

import { useStore } from '@/lib/store';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { ReactNode } from 'react';

interface LogoutButtonProps {
  className?: string;
  children?: ReactNode;
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
  const { clearCart } = useStore();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Clear Zustand store synchronously BEFORE NextAuth triggers a hard reload
    clearCart();
    useStore.setState({ wishlist: [] });

    // Proceed with signout
    await signOut({ callbackUrl: '/' });
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children || (
        <>
          <LogOut className="w-4 h-4" /> Keluar
        </>
      )}
    </button>
  );
}
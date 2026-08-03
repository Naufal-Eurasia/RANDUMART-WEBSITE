import { ReactNode } from 'react';
import Link from 'next/link';
import { Package, LayoutDashboard, Tags, ShoppingCart, LogOut, Settings } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border/60 fixed inset-y-0 left-0 z-10 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border/60">
          <Link href="/" className="font-display font-bold text-xl text-brand-emerald">
            SR12 Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted text-foreground transition-colors">
            <LayoutDashboard className="w-4 h-4 text-muted-foreground" /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted text-foreground transition-colors">
            <Package className="w-4 h-4 text-muted-foreground" /> Produk
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted text-foreground transition-colors">
            <Tags className="w-4 h-4 text-muted-foreground" /> Kategori
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted text-foreground transition-colors">
            <ShoppingCart className="w-4 h-4 text-muted-foreground" /> Pesanan
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted text-foreground transition-colors">
            <Settings className="w-4 h-4 text-muted-foreground" /> Pengaturan
          </Link>
        </nav>
        <div className="p-4 border-t border-border/60">
          <Link href="/api/auth/signout?callbackUrl=/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 text-red-600 transition-colors">
            <LogOut className="w-4 h-4" /> Keluar
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-border/60 flex items-center px-8 justify-end">
           <div className="text-sm font-medium">{session.user.name}</div>
        </header>
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
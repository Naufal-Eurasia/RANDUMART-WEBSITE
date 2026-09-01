'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Package, LayoutDashboard, Tags, ShoppingCart, Settings, Menu, X, ChevronRight, Store, Gift, GalleryHorizontal } from 'lucide-react';
import { LogoutButton } from '@/components/auth/logout-button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produk', icon: Package },
  { href: '/admin/categories', label: 'Kategori', icon: Tags },
  { href: '/admin/orders', label: 'Pesanan', icon: ShoppingCart },
  { href: '/admin/bundles', label: 'Bundling', icon: Gift },
  { href: '/admin/promos', label: 'Banner Promo', icon: GalleryHorizontal },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
];

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-white/10 text-brand-cream'
                : 'text-brand-cream/80 hover:bg-white/10 hover:text-brand-cream'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split('/').filter(Boolean);
  const labels: Record<string, string> = {
    admin: 'Dashboard', products: 'Produk', categories: 'Kategori',
    orders: 'Pesanan', settings: 'Pengaturan', bundles: 'Bundling',
    promos: 'Banner Promo',
  };

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
          <span className={i === segments.length - 1 ? 'text-foreground font-medium' : ''}>
            {labels[seg] || seg}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-brand-green fixed inset-y-0 left-0 z-10 flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="font-display font-bold text-xl text-brand-cream">
            Randumart Admin
          </Link>
        </div>
        <SidebarNav pathname={pathname} />
        <div className="p-4 border-t border-white/10">
          <LogoutButton className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500/20 text-red-400 transition-colors" />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-brand-green border-r-0">
          <SheetHeader className="h-16 flex items-center px-6 border-b border-white/10">
            <SheetTitle className="font-display font-bold text-xl text-brand-cream">Randumart Admin</SheetTitle>
          </SheetHeader>
          <SidebarNav pathname={pathname} onNavigate={() => setSidebarOpen(false)} />
          <div className="p-4 border-t border-white/10">
            <LogoutButton className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500/20 text-red-400 transition-colors" />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-border/60 flex items-center px-4 lg:px-8 justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Breadcrumb pathname={pathname} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium hover:bg-muted px-3 py-1.5 rounded-lg transition-colors">
              <div className="w-7 h-7 rounded-full bg-brand-green text-brand-cream flex items-center justify-center text-xs font-bold">
                {session.user.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <span className="hidden sm:inline">{session.user.name}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-2xl">
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                  <Store className="w-4 h-4" /> Lihat Toko
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-0">
                <LogoutButton className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-red-600 cursor-pointer" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="p-4 lg:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

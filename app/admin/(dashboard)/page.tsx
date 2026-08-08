import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Package, ShoppingCart, Clock, TrendingUp, AlertTriangle, ArrowRight, Tags, CheckCircle2 } from 'lucide-react';
import { formatRupiah } from '@/lib/categories';

const statusColors: Record<string, string> = {
  PENDING: 'bg-[#B8791F] text-white border-transparent',
  PAID: 'bg-[#28331F] text-[#E7DCC3] border-transparent',
  PROCESSING: 'bg-[#E7DCC3] text-[#28331F] border-[#28331F]/20',
  SHIPPED: 'bg-indigo-100 text-indigo-700 border-transparent',
  COMPLETED: 'bg-green-100 text-green-700 border-transparent',
  CANCELLED: 'bg-red-600 text-white border-transparent',
  EXPIRED: 'bg-gray-200 text-gray-700 border-transparent',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Belum Bayar',
  PAID: 'Perlu Dikirim',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
  EXPIRED: 'Kedaluwarsa',
};

export default async function AdminDashboard() {
  const [totalProducts, pendingOrders, paidOrders, totalRevenue, recentOrders, lowStockProducts, totalOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.order.aggregate({
      where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED'] } },
      _sum: { totalAmount: true }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, midtransOrderId: true, guestName: true, totalAmount: true, status: true, createdAt: true }
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      take: 5,
      orderBy: { stock: 'asc' },
      select: { id: true, name: true, stock: true }
    }),
    prisma.order.count()
  ]);

  return (
    <div className="space-y-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Ringkasan aktivitas toko SR12 Anda.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/categories" className="inline-flex items-center justify-center text-sm font-medium transition-colors h-10 px-4 py-2 rounded-xl border border-[#28331F]/20 text-[#28331F] hover:bg-[#E7DCC3]/30">
            Tambah Kategori
          </Link>
          <Link href="/admin/products" className="inline-flex items-center justify-center text-sm font-medium transition-colors h-10 px-4 py-2 rounded-xl bg-[#28331F] text-[#E7DCC3] hover:bg-[#28331F]/90">
            Tambah Produk
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-border/60 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E7DCC3]/50 flex items-center justify-center text-[#28331F]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Pendapatan Bersih</p>
              <h3 className="text-xl font-bold font-display">{formatRupiah(Number(totalRevenue._sum.totalAmount || 0))}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border/60 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#B8791F]/10 flex items-center justify-center text-[#B8791F]">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Pesanan</p>
              <h3 className="text-xl font-bold font-display">{totalOrders} <span className="text-xs text-muted-foreground font-normal ml-1">transaksi</span></h3>
            </div>
          </div>
        </div>

        <div className="bg-[#28331F] text-[#E7DCC3] p-5 rounded-2xl border border-[#28331F] shadow-soft relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#E7DCC3]/10 rounded-full blur-xl"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-[#E7DCC3]/20 flex items-center justify-center text-[#E7DCC3]">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[#E7DCC3]/80 font-medium">Perlu Dikirim (PAID)</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold font-display">{paidOrders}</h3>
                {paidOrders > 0 && <span className="text-xs bg-[#B8791F] text-white px-2 py-0.5 rounded-full font-bold animate-pulse">Penting</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border/60 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Belum Dibayar</p>
              <h3 className="text-xl font-bold font-display">{pendingOrders}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pesanan Terbaru */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-border/60 shadow-soft overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/60 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-display font-bold text-lg flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#28331F]" /> Pesanan Terbaru
            </h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-[#B8791F] hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/30 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Pelanggan</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Belum ada pesanan</td></tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/30">
                      <td className="px-6 py-3 font-medium text-[#28331F]">{o.midtransOrderId || o.id.slice(-8)}</td>
                      <td className="px-6 py-3">
                        <p className="font-semibold">{o.guestName}</p>
                        <p className="text-xs text-muted-foreground">{formatRupiah(Number(o.totalAmount))}</p>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${statusColors[o.status] || 'bg-gray-100'}`}>
                          {statusLabels[o.status] || o.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right text-muted-foreground text-xs">
                        {new Date(o.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-3xl border border-border/60 shadow-soft overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/60 bg-red-50/50">
            <h2 className="font-display font-bold text-lg text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Stok Menipis
            </h2>
          </div>
          <div className="p-2 flex-1">
            {lowStockProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500/50" />
                <p className="text-sm text-muted-foreground">Semua stok produk aman (di atas 5).</p>
              </div>
            ) : (
              <div className="space-y-1">
                {lowStockProducts.map((p) => (
                  <Link href="/admin/products" key={p.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-red-50/50 transition-colors group">
                    <div className="truncate pr-4">
                      <p className="text-sm font-semibold truncate text-[#28331F] group-hover:text-red-700 transition-colors">{p.name}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${p.stock === 0 ? 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80 font-bold' : 'text-foreground'} ${p.stock > 0 ? 'bg-amber-100 text-amber-700 border-transparent font-bold' : 'font-bold'}`}>
                      Sisa {p.stock}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {lowStockProducts.length > 0 && (
            <div className="p-4 border-t border-border/60 text-center bg-gray-50/50">
               <Link href="/admin/products" className="text-sm font-semibold text-muted-foreground hover:text-[#B8791F]">Kelola Stok Produk</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

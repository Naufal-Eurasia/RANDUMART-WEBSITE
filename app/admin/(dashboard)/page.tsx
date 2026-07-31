import { prisma } from '@/lib/prisma';
import { Package, ShoppingCart, Clock } from 'lucide-react';
import { formatRupiah } from '@/lib/categories';

export default async function AdminDashboard() {
  const [totalProducts, pendingOrders, totalRevenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { totalAmount: true }
    })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Ringkasan aktivitas toko Anda.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-soft">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Produk</p>
              <h3 className="text-2xl font-bold font-display">{totalProducts}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-soft">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Pesanan Pending</p>
              <h3 className="text-2xl font-bold font-display">{pendingOrders}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-soft">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Pendapatan (PAID)</p>
              <h3 className="text-2xl font-bold font-display">
                {formatRupiah(Number(totalRevenue._sum.totalAmount || 0))}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
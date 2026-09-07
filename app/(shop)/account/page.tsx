import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { formatRupiah } from '@/lib/categories';
import { Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/logout-button';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: { include: { images: true } } } } }
  });

  return (
    <div className="min-h-screen pt-28 pb-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-border/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            {session.user.image ? (
               <Image src={session.user.image} alt={session.user.name || 'User'} width={64} height={64} className="w-16 h-16 rounded-full object-cover border" />
            ) : (
               <div className="w-16 h-16 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-display text-2xl font-bold">
                 {session.user.name?.charAt(0) || 'U'}
               </div>
            )}
            <div>
              <h1 className="text-2xl font-display font-bold">Halo, {session.user.name}</h1>
              <p className="text-muted-foreground text-sm">{session.user.email}</p>
            </div>
          </div>
          <LogoutButton className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm transition-colors" />
        </div>

        <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-brand-green" /> Riwayat Pesanan Saya
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-soft border border-border/60 text-center">
            <p className="text-muted-foreground mb-4">Anda belum memiliki riwayat pesanan.</p>
            <Link href="/products" className="inline-block px-6 py-2.5 rounded-full bg-brand-green text-white font-semibold hover:bg-brand-greenHover">Mulai Belanja</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-3xl shadow-soft border border-border/60">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 pb-4 border-b border-border/60">
                  <div>
                    <p className="text-xs text-muted-foreground">Order ID: <span className="font-mono text-foreground">{order.id}</span></p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
                    order.status === 'PAID' || order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                    (order.status === 'PENDING' || order.status === 'MENUNGGU_ONGKIR' || order.status === 'MENUNGGU_BAYAR') ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status === 'MENUNGGU_ONGKIR' ? 'Menunggu Ongkir' : order.status === 'MENUNGGU_BAYAR' ? 'Menunggu Bayar' : order.status}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Image src={order.items[0]?.product?.images?.[0]?.url || '/placeholder.jpg'} alt={order.items[0]?.product?.name || "Product"} width={64} height={64} className="w-16 h-16 rounded-xl object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{order.items[0]?.product?.name || 'Produk'}</p>
                    <p className="text-xs text-muted-foreground">{order.items[0]?.quantity} barang x {formatRupiah(Number(order.items[0]?.priceAtPurchase))}</p>
                    {order.items.length > 1 && (
                      <p className="text-xs text-brand-green font-semibold mt-1">+ {order.items.length - 1} produk lainnya</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/60 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">{order.status === 'MENUNGGU_ONGKIR' ? 'Subtotal (belum ongkir)' : 'Total Akhir'}</p>
                    <p className="font-display font-bold text-brand-green">{formatRupiah(Number(order.totalAmount))}</p>
                  </div>
                  <Link href={`/order-confirmation/${order.id}`} className="flex items-center gap-1 text-sm font-semibold text-brand-green hover:underline">
                    Lihat Detail <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

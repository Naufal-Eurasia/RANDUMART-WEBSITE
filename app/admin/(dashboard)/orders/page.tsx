'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Eye, MapPin, Package, Check, X, MessageCircle, Search, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { formatRupiah } from '@/lib/categories';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusColors: Record<string, string> = {
  PENDING: 'bg-brand-gold/20 text-brand-green border border-brand-gold/40',
  PAID: 'bg-brand-green text-brand-cream',
  PROCESSING: 'bg-brand-cream text-brand-green border border-brand-green/20',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-600 text-white',
  EXPIRED: 'bg-gray-200 text-gray-700',
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

type SortKey = 'date' | 'total';

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);

  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (res.ok) setOrders(await res.json());
      else toast.error('Gagal memuat pesanan');
    } catch (err) { toast.error('Kesalahan jaringan'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const openDetail = (order: any) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Gagal mengubah status pesanan');
      } else {
        toast.success(`Status berhasil diubah menjadi ${newStatus}`);
        fetchOrders();
      }
    } catch (err) {
      toast.error('Kesalahan jaringan saat mengubah status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesTab = activeTab === 'ALL' || o.status === activeTab;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(searchLower) ||
      (o.midtransOrderId && o.midtransOrderId.toLowerCase().includes(searchLower)) ||
      o.guestName.toLowerCase().includes(searchLower) ||
      o.guestPhone.includes(searchLower);

    return matchesTab && matchesSearch;
  });

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortedOrders = () => {
    if (!sortConfig) return filteredOrders;
    return [...filteredOrders].sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortConfig.key === 'total') {
        const totalA = Number(a.totalAmount) || 0;
        const totalB = Number(b.totalAmount) || 0;
        return sortConfig.direction === 'asc' ? totalA - totalB : totalB - totalA;
      }
      return 0;
    });
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />;
  };

  const sortedOrders = getSortedOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-display font-bold">Data Pesanan</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari ID, Nama, atau WA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl bg-white"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {['ALL', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-brand-green text-brand-cream shadow-sm'
                : 'bg-white border border-border/60 text-muted-foreground hover:bg-muted'
            }`}
          >
            {tab === 'ALL' ? 'Semua' : statusLabels[tab]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-border/60 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Pesanan</th>
                <th className="px-6 py-4 font-semibold cursor-pointer select-none hover:text-foreground" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">Waktu <SortIcon columnKey="date" /></div>
                </th>
                <th className="px-6 py-4 font-semibold">Pelanggan</th>
                <th className="px-6 py-4 font-semibold cursor-pointer select-none hover:text-foreground" onClick={() => handleSort('total')}>
                  <div className="flex items-center gap-1">Total Pembayaran <SortIcon columnKey="total" /></div>
                </th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? <tr><td colSpan={6} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr> :
                sortedOrders.length === 0 ? <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Tidak ada pesanan ditemukan</td></tr> :
                sortedOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <button onClick={() => openDetail(o)} className="font-semibold text-brand-green hover:underline flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5"/> {o.midtransOrderId || o.id.slice(-8)}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(o.createdAt).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{o.guestName}</p>
                      <p className="text-xs text-muted-foreground">{o.guestPhone}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">{formatRupiah(Number(o.totalAmount))}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[o.status] || 'bg-gray-100'}`}>
                        {statusLabels[o.status] || o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {o.status === 'PENDING' && (
                          <a
                            href={`https://wa.me/${o.guestPhone?.replace(/^0/, '62').replace(/\D/g, '')}?text=Halo%20Kak%20${encodeURIComponent(o.guestName)},%20pesanan%20dengan%20ID%20${o.id.slice(-8)}%20belum%20dibayar.%20Silakan%20lakukan%20pembayaran%20agar%20segera%20diproses.`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                            title="Follow up WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" disabled={updating} className="h-8 rounded-lg text-xs">
                              Ubah Status
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-2xl">
                            <DropdownMenuLabel className="text-xs text-muted-foreground">Update Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {o.status === 'PENDING' ? (
                              <>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(o.id, 'PAID')} className="text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer font-medium">
                                  <Check className="w-4 h-4 mr-2" /> Validasi PAID
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(o.id, 'CANCELLED')} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer font-medium">
                                  <X className="w-4 h-4 mr-2" /> Batalkan
                                </DropdownMenuItem>
                              </>
                            ) : (
                              ['PROCESSING', 'SHIPPED', 'COMPLETED'].map(st => (
                                 <DropdownMenuItem key={st} onClick={() => handleUpdateStatus(o.id, st)} disabled={o.status === st || ['CANCELLED', 'EXPIRED'].includes(o.status)} className="cursor-pointer">
                                    Tandai {statusLabels[st] || st}
                                 </DropdownMenuItem>
                              ))
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Pesanan */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl mb-2">Detail Pesanan</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
                  <h4 className="font-semibold mb-3 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand-green"/> Info Pengiriman</h4>
                  <p className="font-medium mb-1">{selectedOrder.guestName}</p>
                  <p className="text-muted-foreground mb-1">{selectedOrder.guestPhone}</p>
                  <p className="text-muted-foreground mb-3">{selectedOrder.guestEmail}</p>
                  <p className="leading-relaxed bg-white p-2.5 rounded-xl border">{selectedOrder.shippingAddress}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-2xl border border-border/50 space-y-2">
                  <h4 className="font-semibold mb-3">Info Transaksi</h4>
                  <div className="flex justify-between"><span className="text-muted-foreground">Status</span> <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[selectedOrder.status]}`}>{statusLabels[selectedOrder.status] || selectedOrder.status}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span> <span className="font-medium">{selectedOrder.midtransOrderId || selectedOrder.id}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Waktu</span> <span>{new Date(selectedOrder.createdAt).toLocaleString('id-ID')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Bayar</span> <span className="font-bold text-brand-green">{formatRupiah(Number(selectedOrder.totalAmount))}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-1.5"><Package className="w-4 h-4 text-brand-green"/> Item Dibeli ({selectedOrder.items.length})</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-white border rounded-2xl">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product?.name || 'Produk Dihapus'}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} x {formatRupiah(Number(item.priceAtPurchase))}</p>
                      </div>
                      <span className="font-semibold text-sm">{formatRupiah(Number(item.priceAtPurchase) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

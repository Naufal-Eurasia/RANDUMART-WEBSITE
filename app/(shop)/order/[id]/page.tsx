import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatRupiah } from '@/lib/categories';
import { Metadata } from 'next';
import { Package, Truck, CheckCircle2, Clock, Check, Receipt, CreditCard } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lacak Pesanan | Randumart',
  robots: {
    index: false,
    follow: false,
  },
};

// Rate limiting in-memory sederhana per instance lambda/server
// Hanya meredam brute-force manual (refresh F5), tidak tahan serangan terdistribusi.
// Proteksi jangka panjang akan menguatkan entropi ID pesanan pasca-launch.
const requestCounts = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 menit
const MAX_REQUESTS = 20;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  if (!record || record.expiresAt < now) {
    requestCounts.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  record.count += 1;
  return true;
}

// ponytail: ambil segmen terakhir setelah koma (biasanya kota/provinsi).
function maskAddress(addr: string): string {
  const parts = addr.split(',').map((s) => s.trim()).filter(Boolean);
  const tail = parts.length > 1 ? parts[parts.length - 1] : '';
  return tail ? `••••, ${tail}` : '••••';
}

type OrderStatus = 'PENDING' | 'MENUNGGU_ONGKIR' | 'MENUNGGU_BAYAR' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

const STATUS_STEPS: Record<OrderStatus, number> = {
  PENDING: 1, // Alur lama (langsung bayar)
  MENUNGGU_ONGKIR: 1,
  MENUNGGU_BAYAR: 2,
  PAID: 3,
  PROCESSING: 4,
  SHIPPED: 5,
  COMPLETED: 6,
  CANCELLED: -1,
  EXPIRED: -1,
};

export default async function TrackOrderPage({ params }: { params: { id: string } }) {
  // Dalam App Router, mendeteksi IP klien secara andal seringkali memerlukan header dari reverse proxy
  // atau middleware. Kita gunakan IP dummy untuk rate limit instance lokal.
  const isAllowed = checkRateLimit('anonymous-user');
  if (!isAllowed) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold mb-2">Terlalu Banyak Permintaan</h1>
        <p className="text-muted-foreground">Silakan tunggu sesaat sebelum memuat ulang halaman.</p>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      midtransOrderId: true,
      status: true,
      createdAt: true,
      totalAmount: true,
      shippingCost: true,
      guestName: true,
      shippingAddress: true,
      items: {
        select: {
          quantity: true,
          priceAtPurchase: true,
          product: { select: { name: true } }
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  const currentStep = STATUS_STEPS[order.status as OrderStatus] || 1;
  const isFailed = order.status === 'CANCELLED' || order.status === 'EXPIRED';
  const subtotal = order.items.reduce((sum, item) => sum + (Number(item.priceAtPurchase) * item.quantity), 0);

  const steps = [
    { num: 1, label: 'Pesanan Dibuat', icon: Receipt, done: currentStep >= 1 },
    { num: 2, label: 'Menunggu Pembayaran', icon: CreditCard, done: currentStep >= 2 },
    { num: 3, label: 'Pesanan Dibayar', icon: CheckCircle2, done: currentStep >= 3 },
    { num: 4, label: 'Diproses', icon: Package, done: currentStep >= 4 },
    { num: 5, label: 'Dikirim', icon: Truck, done: currentStep >= 5 },
  ];

  // Khusus PENDING (alur lama/lama tertinggal), lewati step ongkir
  if (order.status === 'PENDING') {
    steps[1].label = 'Menunggu Pembayaran';
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="text-brand-green text-sm font-semibold hover:underline">
            &larr; Kembali ke Beranda
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-border/60 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold">Status Pesanan</h1>
              <p className="text-muted-foreground mt-1">ID: <span className="font-mono font-medium text-foreground">{order.midtransOrderId || order.id}</span></p>
            </div>
            {isFailed ? (
              <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-red-100 text-red-700 border border-red-200">
                {order.status === 'CANCELLED' ? 'DIBATALKAN' : 'KEDALUWARSA'}
              </span>
            ) : order.status === 'COMPLETED' ? (
              <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                SELESAI
              </span>
            ) : (
              <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-brand-green/10 text-brand-green border border-brand-green/20">
                DALAM PROSES
              </span>
            )}
          </div>

          {!isFailed && order.status !== 'COMPLETED' && (
            <div className="py-8 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full"></div>
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-green rounded-full transition-all duration-500"
                style={{ width: `${((Math.max(1, Math.min(5, currentStep)) - 1) / 4) * 100}%` }}
              ></div>

              <div className="relative flex justify-between">
                {steps.map((step) => {
                  const active = currentStep >= step.num;
                  const current = currentStep === step.num;
                  const Icon = step.icon;
                  return (
                    <div key={step.num} className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 sm:w-12 h-12 rounded-full flex items-center justify-center border-4 border-white relative z-10 transition-colors ${
                        active ? 'bg-brand-green text-white' : 'bg-muted text-muted-foreground'
                      } ${current ? 'ring-4 ring-brand-green/20' : ''}`}>
                        {active && !current ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-semibold max-w-[70px] text-center ${
                        active ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {order.status === 'MENUNGGU_ONGKIR' && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <strong className="block mb-1">Pesanan Sedang Dihitung</strong>
              Admin sedang mengecek biaya ongkos kirim terbaik ke alamat Anda. Invoice final akan dikirim melalui WhatsApp Anda.
            </div>
          )}

          {order.status === 'MENUNGGU_BAYAR' && (
            <div className="mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-sm">
              <strong className="block mb-1">Menunggu Pembayaran</strong>
              Biaya ongkir telah ditambahkan. Silakan cek pesan WhatsApp dari Admin untuk informasi rekening pembayaran.
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-soft">
            <h2 className="font-display font-bold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" /> Rincian Pesanan
            </h2>
            <div className="space-y-3 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.quantity}x {item.product.name}</span>
                  <span className="font-medium whitespace-nowrap">{formatRupiah(Number(item.priceAtPurchase) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border/60 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ongkos Kirim</span>
                <span>{Number(order.shippingCost) > 0 ? formatRupiah(Number(order.shippingCost)) : <span className="text-amber-600 text-xs">Menunggu Admin</span>}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-bold">Total Akhir</span>
                <span className="font-bold text-brand-green text-lg">{formatRupiah(Number(order.totalAmount))}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-soft h-fit">
            <h2 className="font-display font-bold mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-muted-foreground" /> Info Pengiriman
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Nama Penerima</p>
                <p className="font-medium">{order.guestName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Alamat</p>
                <p className="font-medium leading-relaxed">{maskAddress(order.shippingAddress)}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Sebagian alamat disembunyikan demi keamanan privasi.</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Tanggal Order</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
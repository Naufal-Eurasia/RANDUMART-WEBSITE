import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatRupiah } from '@/lib/categories';
import { buildOrderMessage, buildWaLink, subtotalOf } from '@/lib/whatsapp';
import { CheckCircle2, Clock, MapPin, Package, AlertCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

// Halaman ini PUBLIK (middleware.ts:25 hanya menjaga /admin & /account) dan
// order.id adalah cuid — timestamp + counter + fingerprint + 4 karakter acak,
// jadi bukan rahasia yang kuat. Alamat hanya ditampilkan sebagian: cukup untuk
// pemesan mengenali tujuan kirimnya, tidak cukup untuk orang lain memakainya.
// ponytail: ambil segmen terakhir setelah koma (biasanya kota/provinsi).
// Kalau nanti alamat jadi terstruktur (Blok B), ganti dengan field kota saja.
function maskAddress(addr: string): string {
  const parts = addr.split(',').map((s) => s.trim()).filter(Boolean);
  const tail = parts.length > 1 ? parts[parts.length - 1] : '';
  return tail ? `••••, ${tail}` : '••••';
}

export default async function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const [order, storeSetting] = await Promise.all([
    prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    }),
    prisma.storeSetting.findUnique({ where: { id: 'singleton' } })
  ]);

  if (!order) {
    notFound();
  }

  // Tanpa fallback hardcode. Nomor '6281234567890' yang dulu dipakai di sini
  // milik pihak asing: kalau StoreSetting kosong, data pesanan pelanggan asli
  // terkirim ke orang yang tidak dikenal. Lebih baik tombol mati dan terlihat
  // rusak daripada diam-diam mengirim ke nomor salah.
  // buildWaLink mengembalikan null kalau nomornya kosong atau tidak masuk akal.
  const waLink = buildWaLink(storeSetting?.whatsappNumber, buildOrderMessage(order));
  const isPending = order.status === 'PENDING' || order.status === 'MENUNGGU_ONGKIR' || order.status === 'MENUNGGU_BAYAR';
  const isPaid = order.status === 'PAID' || order.status === 'COMPLETED' || order.status === 'SHIPPED' || order.status === 'PROCESSING';
  const isExpired = order.status === 'EXPIRED';

  return (
    <div className="min-h-screen pt-28 pb-20 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Status */}
        <div className="bg-white rounded-3xl p-8 text-center shadow-soft border border-border/60 mb-8">
          {isPending ? (
            <>
              <div className="grid place-items-center w-20 h-20 rounded-full bg-amber-100 mx-auto mb-5">
                <Clock className="w-10 h-10 text-amber-500" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">Menunggu Pembayaran</h1>
              <p className="text-muted-foreground">Pesanan Anda berhasil dibuat. Silakan selesaikan pembayaran agar pesanan dapat diproses.</p>
            </>
          ) : isPaid ? (
             <>
              <div className="grid place-items-center w-20 h-20 rounded-full bg-emerald-100 mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10 text-brand-green" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">Pesanan Berhasil!</h1>
              <p className="text-muted-foreground">Terima kasih atas pesanan Anda. Kami akan segera memprosesnya.</p>
            </>
          ) : isExpired ? (
            <>
               <div className="grid place-items-center w-20 h-20 rounded-full bg-red-100 mx-auto mb-5">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">Pesanan Kedaluwarsa</h1>
              <p className="text-muted-foreground">Waktu pembayaran telah habis, pesanan otomatis dibatalkan.</p>
            </>
          ) : (
            <>
               <div className="grid place-items-center w-20 h-20 rounded-full bg-red-100 mx-auto mb-5">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">Pesanan Dibatalkan</h1>
              <p className="text-muted-foreground">Pesanan ini telah dibatalkan.</p>
            </>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
             <div className="px-4 py-2 rounded-xl bg-muted font-medium">Order ID: <span className="font-bold">{order.id}</span></div>
             <div className="px-4 py-2 rounded-xl bg-muted font-medium">Midtrans ID: <span className="font-bold">{order.midtransOrderId}</span></div>
          </div>
        </div>

        {/* Action Button */}
        {isPending && (
          <div className="bg-white p-6 rounded-[2rem] border border-border/40 shadow-sm mb-8">
             <div className="text-center mb-6">
               <p className="text-sm font-semibold text-amber-600 bg-amber-50 inline-block px-4 py-1.5 rounded-full mb-3">Langkah Terakhir</p>
               <h3 className="font-display font-bold text-2xl">Konfirmasi via WhatsApp</h3>
               <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">Pesanan Anda telah tercatat. Klik tombol di bawah ini dalam waktu 1x24 jam untuk mendapatkan informasi nomor rekening dan menyelesaikan pembayaran Anda.</p>
             </div>

             <div className="flex flex-col items-center justify-center">
               {waLink ? (
                 <a
                   href={waLink}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex w-full sm:w-auto items-center justify-center gap-2 px-10 py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-soft active:scale-[0.98] transition-all"
                 >
                   Kirim Konfirmasi ke WhatsApp Admin
                 </a>
               ) : (
                 <div className="text-center">
                   <button
                     disabled
                     className="flex w-full sm:w-auto items-center justify-center gap-2 px-10 py-4 rounded-xl bg-muted text-muted-foreground font-semibold cursor-not-allowed"
                   >
                     Nomor Admin Belum Diatur
                   </button>
                   <p className="text-xs text-muted-foreground mt-3">
                     Hubungi admin melalui kontak di halaman utama dengan menyebut kode pesanan di atas.
                   </p>
                 </div>
               )}
             </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-8">
          {/* Rincian Item */}
          <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-soft">
             <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
               <Package className="w-5 h-5 text-muted-foreground" />
               Rincian Pesanan
             </h2>
             <div className="space-y-4">
               {order.items.map(item => (
                 <div key={item.id} className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity} x {formatRupiah(Number(item.priceAtPurchase))}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatRupiah(Number(item.priceAtPurchase) * item.quantity)}</span>
                 </div>
               ))}
             </div>
             {/* Subtotal dihitung dari item, bukan `totalAmount - shippingCost`.
                 Rumus lama salah: saat ongkir belum diisi, totalAmount memang
                 subtotal, jadi mengurangi ongkir lagi akan menghitung ganda
                 begitu ongkir terisi. Angka di sini tidak bergantung status. */}
             <div className="border-t border-border/60 mt-4 pt-4 space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Subtotal</span>
                 <span className="font-medium">{formatRupiah(subtotalOf(order.items))}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Biaya Kirim</span>
                 {Number(order.shippingCost) > 0 ? (
                   <span className="font-medium">{formatRupiah(Number(order.shippingCost))}</span>
                 ) : (
                   <span className="font-medium text-amber-600">Dihitung Admin via WA</span>
                 )}
               </div>
               <div className="flex justify-between text-base font-bold pt-2">
                 <span>{Number(order.shippingCost) > 0 ? 'Total Akhir' : 'Subtotal (belum termasuk ongkir)'}</span>
                 <span className="text-brand-green">{formatRupiah(Number(order.totalAmount))}</span>
               </div>
             </div>
          </div>

          {/* Rincian Pengiriman */}
          <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-soft">
             <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
               <MapPin className="w-5 h-5 text-muted-foreground" />
               Alamat Pengiriman
             </h2>
             {/* Nomor telepon & email dihapus, alamat disamarkan: halaman ini
                 publik. Pemesan sudah tahu datanya sendiri, jadi menampilkannya
                 tidak menambah nilai — hanya menambah yang bisa bocor. */}
             <div className="space-y-3 text-sm">
               <div>
                 <p className="text-muted-foreground text-xs mb-0.5">Nama Penerima</p>
                 <p className="font-medium">{order.guestName}</p>
               </div>
               <div>
                 <p className="text-muted-foreground text-xs mb-0.5">Alamat Pengiriman</p>
                 <p className="font-medium leading-relaxed">{maskAddress(order.shippingAddress)}</p>
                 <p className="text-xs text-muted-foreground mt-1">
                   Alamat lengkap disembunyikan demi keamanan. Admin sudah menerimanya.
                 </p>
               </div>
             </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/products" className="text-brand-green text-sm font-semibold hover:underline">
            &larr; Lanjut Belanja
          </Link>
        </div>

      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { formatRupiah } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, CheckCircle2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useStore();

  // Mounted state untuk menghindari hydration error dari Zustand cart
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Keranjang kosong!');

    // Validasi frontend: hanya Nama, Telepon, dan Alamat yang wajib diisi
    if (!formData.name.trim()) return toast.error('Nama Lengkap wajib diisi');
    if (!formData.phone.trim()) return toast.error('Nomor Telepon (WA) wajib diisi');
    if (!formData.address.trim()) return toast.error('Alamat Pengiriman wajib diisi');

    setLoading(true);

    try {
      // Menyiapkan payload sesuai format yang diexpect API
      const items = cart.map(c => ({
        productId: c.product.id,
        quantity: c.quantity
      }));

      // Email opsional — dikirim apa adanya (string kosong jika tidak diisi).
      // Kolom guestEmail di DB bertipe String? sehingga aman menerima nilai kosong/null.
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, items })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Gagal membuat pesanan');
        setLoading(false);
        return;
      }

      // Berhasil
      toast.success('Pesanan berhasil dibuat!');
      clearCart();
      // Redirect ke halaman konfirmasi
      router.push(`/order-confirmation/${data.orderId}`);

    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan sistem, silakan coba lagi');
      setLoading(false);
    }
  };

  // Render Skeleton saat mounted belum terjadi untuk bypass hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen pt-24 lg:pt-28 pb-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="w-32 h-4 bg-muted-foreground/20 rounded animate-pulse mb-6"></div>
          <div className="w-48 h-8 bg-muted-foreground/20 rounded animate-pulse mb-8"></div>
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
            <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-soft h-[500px] animate-pulse"></div>
            <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-soft h-[400px] animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Jika keranjang kosong
  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-20 max-w-2xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-brand-green/10 text-brand-green rounded-full grid place-items-center mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold font-display mb-3 tracking-tight">Keranjang Kosong</h1>
        <p className="text-muted-foreground mb-10 max-w-sm leading-relaxed">Sepertinya Anda belum memilih produk apapun. Temukan produk herbal & skincare terbaik kami.</p>
        <Link href="/products">
          <Button className="rounded-xl h-12 px-8 bg-brand-green hover:bg-brand-greenHover text-white font-medium active:scale-[0.98] transition-transform">
            Jelajahi Produk
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-20 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-brand-green mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali belanja
        </Link>

        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* Bagian Kiri: Form Identitas */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-border/40 shadow-sm">
            <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green grid place-items-center text-sm font-semibold">1</span>
              Informasi Pengiriman
            </h2>

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Budi Santoso" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Nomor Telepon (WA)</Label>
                  <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="08123456789" className="rounded-xl" />
                </div>
              </div>

              {/* Field email disembunyikan — tidak wajib diisi pelanggan */}
              <input type="hidden" name="email" value={formData.email} />

              <div className="space-y-1.5">
                <Label htmlFor="address">Alamat Pengiriman Lengkap</Label>
                <Textarea id="address" name="address" required value={formData.address} onChange={handleChange} placeholder="Jl. Jend. Sudirman No. 10, RT/RW, Kelurahan, Kecamatan, Kota..." className="rounded-xl min-h-[100px]" />
              </div>
            </form>
          </div>

          {/* Bagian Kanan: Ringkasan Order */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-border/40 shadow-sm sticky top-28">
             <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green grid place-items-center text-sm font-semibold">2</span>
              Ringkasan Pesanan
            </h2>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar mb-6">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-start gap-3">
                  <Image src={item.product.image || (item.product as any).imageGallery?.[0] || '/placeholder.jpg'} alt={item.product.name} width={64} height={64} className="w-16 h-16 rounded-lg object-cover bg-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-2">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.quantity} x {formatRupiah(item.product.price)}</p>
                  </div>
                  <span className="text-sm font-semibold whitespace-nowrap">{formatRupiah(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border/60 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal Produk</span>
                <span className="font-medium">{formatRupiah(cartTotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Biaya Kirim</span>
                <span className="font-medium text-amber-600">Dihitung Admin via WA</span>
              </div>
              <div className="border-t border-border/60 pt-3 flex justify-between items-center">
                <span className="font-bold font-display text-lg">Total Bayar</span>
                <span className="font-bold font-display text-xl text-brand-green">{formatRupiah(cartTotal())}</span>
              </div>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full h-14 rounded-2xl mt-8 bg-brand-green hover:bg-brand-greenHover text-white font-semibold text-base shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Buat Pesanan Sekarang'}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Sistem aman dan data Anda terlindungi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
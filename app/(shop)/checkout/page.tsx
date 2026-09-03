'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useStore } from '@/lib/store';
import { formatRupiah } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, CheckCircle2, ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

interface WilayahOption {
  id: string;
  name: string;
}

interface ShippingOption {
  service: string;
  description: string;
  cost: number;
  etd: string;
}

// Product belum punya field berat di schema, jadi ongkir dihitung pakai estimasi
// berat per unit produk. Sesuaikan angka ini kalau berat rata-rata produk berubah.
const DEFAULT_ITEM_WEIGHT_GRAM = 500;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
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

  // Wilayah (cascading dropdown RajaOngkir)
  const [provinces, setProvinces] = useState<WilayahOption[]>([]);
  const [cities, setCities] = useState<WilayahOption[]>([]);
  const [subdistricts, setSubdistricts] = useState<WilayahOption[]>([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingSubdistricts, setLoadingSubdistricts] = useState(false);

  // Input manual: Kelurahan, RT/RW, Kode Pos
  const [kelurahan, setKelurahan] = useState('');
  const [rtRw, setRtRw] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Ongkir
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const shippingCost = selectedShipping?.cost ?? 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-fill email dari akun yang sedang login, biar pelanggan tidak ketik ulang
  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => (prev.email ? prev : { ...prev, email: session.user!.email! }));
    }
  }, [session]);

  // 1. Muat daftar provinsi saat halaman dibuka
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const res = await fetch('/api/wilayah?type=province');
        const data = await res.json();
        if (res.ok) {
          setProvinces(data);
        } else {
          toast.error(data.message || 'Gagal memuat daftar provinsi');
        }
      } catch {
        toast.error('Gagal memuat daftar provinsi');
      } finally {
        setLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  // 2. Saat provinsi dipilih, muat daftar kota & reset pilihan di bawahnya
  useEffect(() => {
    setCities([]);
    setSelectedCity('');
    setSubdistricts([]);
    setSelectedSubdistrict('');
    setShippingOptions([]);
    setSelectedShipping(null);

    if (!selectedProvince) return;

    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const res = await fetch(`/api/wilayah?type=city&id=${selectedProvince}`);
        const data = await res.json();
        if (res.ok) {
          setCities(data);
        } else {
          toast.error(data.message || 'Gagal memuat daftar kota/kabupaten');
        }
      } catch {
        toast.error('Gagal memuat daftar kota/kabupaten');
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [selectedProvince]);

  // 3. Saat kota dipilih, muat daftar kecamatan & reset pilihan di bawahnya
  useEffect(() => {
    setSubdistricts([]);
    setSelectedSubdistrict('');
    setShippingOptions([]);
    setSelectedShipping(null);

    if (!selectedCity) return;

    const loadSubdistricts = async () => {
      setLoadingSubdistricts(true);
      try {
        const res = await fetch(`/api/wilayah?type=subdistrict&id=${selectedCity}`);
        const data = await res.json();
        if (res.ok) {
          setSubdistricts(data);
        } else {
          toast.error(data.message || 'Gagal memuat daftar kecamatan');
        }
      } catch {
        toast.error('Gagal memuat daftar kecamatan');
      } finally {
        setLoadingSubdistricts(false);
      }
    };
    loadSubdistricts();
  }, [selectedCity]);

  // 4. Saat kecamatan dipilih, otomatis hitung ongkir ke kota tujuan
  useEffect(() => {
    setShippingOptions([]);
    setSelectedShipping(null);

    if (!selectedSubdistrict || !selectedCity) return;

    const originCityId = process.env.NEXT_PUBLIC_ORIGIN_CITY_ID;
    if (!originCityId) {
      toast.error('ID kota asal toko (NEXT_PUBLIC_ORIGIN_CITY_ID) belum diatur di .env');
      return;
    }

    const totalWeight = cart.reduce((sum, c) => sum + c.quantity * DEFAULT_ITEM_WEIGHT_GRAM, 0);

    const loadShippingCost = async () => {
      setLoadingShipping(true);
      try {
        const res = await fetch('/api/ongkir', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: originCityId,
            destination: selectedCity,
            weight: totalWeight,
            courier: 'jne',
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setShippingOptions(data.costs || []);
        } else {
          toast.error(data.message || 'Gagal menghitung ongkir');
        }
      } catch {
        toast.error('Gagal menghitung ongkir');
      } finally {
        setLoadingShipping(false);
      }
    };
    loadShippingCost();
  }, [selectedSubdistrict, selectedCity, cart]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Keranjang kosong!');

    // Validasi frontend: Nama, Email, Telepon, dan Alamat wajib diisi
    if (!formData.name.trim()) return toast.error('Nama Lengkap wajib diisi');
    if (!formData.email.trim()) return toast.error('Email wajib diisi');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return toast.error('Format email tidak valid');
    if (!formData.phone.trim()) return toast.error('Nomor Telepon (WA) wajib diisi');
    if (!formData.address.trim()) return toast.error('Nama Jalan & Nomor Rumah wajib diisi');

    // Validasi wilayah & ongkir
    if (!selectedProvince) return toast.error('Provinsi wajib dipilih');
    if (!selectedCity) return toast.error('Kota/Kabupaten wajib dipilih');
    if (!selectedSubdistrict) return toast.error('Kecamatan wajib dipilih');
    if (!kelurahan.trim()) return toast.error('Kelurahan wajib diisi');
    if (!rtRw.trim()) return toast.error('RT/RW wajib diisi');
    if (!/^\d{5}$/.test(postalCode.trim())) return toast.error('Kode Pos harus 5 digit angka');
    if (!selectedShipping) return toast.error('Pilih layanan pengiriman terlebih dahulu');

    setLoading(true);

    try {
      // Menyiapkan payload sesuai format yang diexpect API
      const items = cart.map(c => ({
        productId: c.product.id,
        quantity: c.quantity
      }));

      const provinceName = provinces.find((p) => p.id === selectedProvince)?.name || '';
      const cityName = cities.find((c) => c.id === selectedCity)?.name || '';
      const subdistrictName = subdistricts.find((s) => s.id === selectedSubdistrict)?.name || '';

      // Gabungkan detail jalan + wilayah berjenjang jadi satu alamat lengkap
      // (kolom shippingAddress di DB tetap satu string, tidak ada perubahan skema)
      const fullAddress = [
        formData.address.trim(),
        `Kel. ${kelurahan.trim()}`,
        `RT/RW ${rtRw.trim()}`,
        subdistrictName,
        cityName,
        provinceName,
        postalCode.trim(),
      ].filter(Boolean).join(', ');

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, address: fullAddress, items, shippingCost })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Gagal membuat pesanan');
        setLoading(false);
        return;
      }

      // Order berhasil dibuat (status PENDING), lanjut minta Snap Token untuk pembayaran
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderId })
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok || !checkoutData.token) {
        toast.error(checkoutData.message || 'Gagal memulai pembayaran');
        setLoading(false);
        return;
      }

      if (!window.snap) {
        toast.error('Modul pembayaran belum siap, silakan coba lagi');
        setLoading(false);
        return;
      }

      window.snap.pay(checkoutData.token, {
        onSuccess: () => {
          clearCart();
          toast.success('Pembayaran berhasil!');
          router.push(`/order-confirmation/${data.orderId}`);
        },
        onPending: () => {
          clearCart();
          toast.success('Pesanan dibuat, selesaikan pembayaran sesuai instruksi');
          router.push(`/order-confirmation/${data.orderId}`);
        },
        onError: () => {
          toast.error('Pembayaran gagal, silakan coba lagi');
          setLoading(false);
        },
        onClose: () => {
          toast.info('Pembayaran dibatalkan');
          setLoading(false);
        },
      });

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
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
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

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="nama@email.com" className="rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">Nama Jalan & Nomor Rumah</Label>
                <Textarea id="address" name="address" required value={formData.address} onChange={handleChange} placeholder="Jl. Jend. Sudirman No. 10" className="rounded-xl min-h-[80px]" />
              </div>

              {/* Wilayah berjenjang: Provinsi -> Kota/Kabupaten -> Kecamatan */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="province">Provinsi</Label>
                  <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                    <SelectTrigger id="province" className="rounded-xl">
                      <SelectValue placeholder={loadingProvinces ? 'Memuat...' : 'Pilih Provinsi'} />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="city">Kota/Kabupaten</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedProvince}>
                    <SelectTrigger id="city" className="rounded-xl">
                      <SelectValue placeholder={loadingCities ? 'Memuat...' : 'Pilih Kota/Kabupaten'} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="subdistrict">Kecamatan</Label>
                  <Select value={selectedSubdistrict} onValueChange={setSelectedSubdistrict} disabled={!selectedCity}>
                    <SelectTrigger id="subdistrict" className="rounded-xl">
                      <SelectValue placeholder={loadingSubdistricts ? 'Memuat...' : 'Pilih Kecamatan'} />
                    </SelectTrigger>
                    <SelectContent>
                      {subdistricts.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="kelurahan">Kelurahan</Label>
                  <Input id="kelurahan" name="kelurahan" required value={kelurahan} onChange={(e) => setKelurahan(e.target.value)} placeholder="Nama Kelurahan" className="rounded-xl" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="rtRw">RT/RW</Label>
                  <Input id="rtRw" name="rtRw" required value={rtRw} onChange={(e) => setRtRw(e.target.value)} placeholder="001/002" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="postalCode">Kode Pos</Label>
                  <Input id="postalCode" name="postalCode" required inputMode="numeric" maxLength={5} value={postalCode} onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))} placeholder="12345" className="rounded-xl" />
                </div>
              </div>

              {/* Pilihan layanan ongkir, muncul otomatis setelah kecamatan dipilih */}
              {selectedSubdistrict && (
                <div className="space-y-2 pt-2">
                  <Label className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4" /> Pilihan Pengiriman (JNE)
                  </Label>

                  {loadingShipping && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
                      <Loader2 className="w-4 h-4 animate-spin" /> Menghitung ongkir...
                    </div>
                  )}

                  {!loadingShipping && shippingOptions.length === 0 && (
                    <p className="text-sm text-muted-foreground py-2">Ongkir belum tersedia untuk tujuan ini.</p>
                  )}

                  {!loadingShipping && shippingOptions.length > 0 && (
                    <RadioGroup
                      value={selectedShipping?.service || ''}
                      onValueChange={(value) => {
                        const option = shippingOptions.find((o) => o.service === value) || null;
                        setSelectedShipping(option);
                      }}
                      className="space-y-2"
                    >
                      {shippingOptions.map((option) => (
                        <label
                          key={option.service}
                          htmlFor={`shipping-${option.service}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-4 py-3 text-sm cursor-pointer hover:border-brand-green/60 transition-colors has-[[data-state=checked]]:border-brand-green has-[[data-state=checked]]:bg-brand-green/5"
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={option.service} id={`shipping-${option.service}`} />
                            <div>
                              <p className="font-medium">{option.service} - {option.description}</p>
                              <p className="text-xs text-muted-foreground">Estimasi {option.etd} hari</p>
                            </div>
                          </div>
                          <span className="font-semibold whitespace-nowrap">{formatRupiah(option.cost)}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              )}
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
                <span className="font-medium">
                  {selectedShipping ? formatRupiah(shippingCost) : 'Pilih kecamatan dahulu'}
                </span>
              </div>
              <div className="border-t border-border/60 pt-3 flex justify-between items-center">
                <span className="font-bold font-display text-lg">Total Bayar</span>
                <span className="font-bold font-display text-xl text-brand-green">{formatRupiah(cartTotal() + shippingCost)}</span>
              </div>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full h-14 rounded-2xl mt-8 bg-brand-green hover:bg-brand-greenHover text-white font-semibold text-base shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Bayar'}
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

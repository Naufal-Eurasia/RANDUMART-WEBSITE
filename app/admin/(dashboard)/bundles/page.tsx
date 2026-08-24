'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Plus, Edit2, Trash2, Loader2, PackageOpen, ShoppingBag, X, Search,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/categories';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProductImage { url: string; isPrimary: boolean }
interface Product {
  id: string; name: string; price: number | string;
  images: ProductImage[];
}
interface BundleItemRow { productId: string; quantity: number }
interface BundleItem { id: string; productId: string; quantity: number; product: Product }
interface Bundle { id: string; name: string; items: BundleItem[] }

const EMPTY_FORM = { name: '', items: [] as BundleItemRow[] };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcTotal(items: BundleItemRow[], allProducts: Product[]): number {
  return items.reduce((sum, row) => {
    const p = allProducts.find((x) => x.id === row.productId);
    return sum + (p ? Number(p.price) * row.quantity : 0);
  }, 0);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BundlesAdminPage() {
  const [bundles, setBundles]     = useState<Bundle[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode]     = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [formData, setFormData]       = useState<{ name: string; items: BundleItemRow[] }>(EMPTY_FORM);

  // Product picker inside modal
  const [productSearch, setProductSearch] = useState('');

  // Delete confirm
  const [deleteOpen, setDeleteOpen]   = useState(false);
  const [bundleToDelete, setBundleToDelete] = useState<Bundle | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, pRes] = await Promise.all([
        fetch('/api/admin/bundles', { cache: 'no-store' }),
        fetch('/api/admin/products', { cache: 'no-store' }),
      ]);
      if (bRes.ok) setBundles(await bRes.json());
      if (pRes.ok) setAllProducts(await pRes.json());
    } catch {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setProductSearch('');
    setIsModalOpen(true);
  };

  const openEdit = (b: Bundle) => {
    setModalMode('edit');
    setEditingId(b.id);
    setFormData({
      name: b.name,
      items: b.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });
    setProductSearch('');
    setIsModalOpen(true);
  };

  // ── Item management ────────────────────────────────────────────────────────
  const addProduct = (productId: string) => {
    if (formData.items.find((i) => i.productId === productId)) {
      toast.info('Produk sudah ada di bundle');
      return;
    }
    setFormData((prev) => ({ ...prev, items: [...prev.items, { productId, quantity: 1 }] }));
  };

  const removeItem = (productId: string) => {
    setFormData((prev) => ({ ...prev, items: prev.items.filter((i) => i.productId !== productId) }));
  };

  const updateQty = (productId: string, qty: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((i) => i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i),
    }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Nama bundle wajib diisi'); return; }
    if (formData.items.length === 0) { toast.error('Pilih minimal 1 produk'); return; }

    setSubmitting(true);
    try {
      const url    = modalMode === 'edit' ? `/api/admin/bundles/${editingId}` : '/api/admin/bundles';
      const method = modalMode === 'edit' ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || 'Gagal menyimpan bundle'); return; }
      toast.success(modalMode === 'edit' ? 'Bundle berhasil diperbarui' : 'Bundle berhasil dibuat');
      setIsModalOpen(false);
      fetchData();
    } catch {
      toast.error('Kesalahan koneksi');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!bundleToDelete) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/bundles/${bundleToDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) toast.error(data.message || 'Gagal menghapus');
      else { toast.success('Bundle dihapus'); fetchData(); }
    } catch {
      toast.error('Kesalahan koneksi');
    } finally {
      setSubmitting(false);
      setDeleteOpen(false);
      setBundleToDelete(null);
    }
  };

  // ── Filtered product list for picker ──────────────────────────────────────
  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
    !formData.items.find((i) => i.productId === p.id)
  );

  const totalPreview = calcTotal(formData.items, allProducts);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Bundling / Parsel</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Kelola paket bundling produk untuk customer</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-[#28331F] hover:bg-[#28331F]/90 text-[#E7DCC3] rounded-xl shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Bundle
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#28331F]" />
        </div>
      ) : bundles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground">
          <PackageOpen className="w-12 h-12 opacity-40" />
          <p className="text-sm">Belum ada bundle. Klik &quot;Tambah Bundle&quot; untuk memulai.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border/60">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Nama Bundle</th>
                  <th className="text-center px-5 py-3 font-semibold text-muted-foreground">Jml Produk</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">Total Harga</th>
                  <th className="text-center px-5 py-3 font-semibold text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {bundles.map((b) => {
                  const total = b.items.reduce(
                    (sum, i) => sum + Number(i.product.price) * i.quantity, 0
                  );
                  return (
                    <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#28331F]/10 flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="w-4 h-4 text-[#28331F]" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#28331F]">{b.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {b.items.map((i) => i.product.name).join(', ')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Badge variant="secondary" className="rounded-full">
                          {b.items.length} produk
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-[#28331F]">
                        {formatRupiah(total)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(b)}
                            className="rounded-lg h-8 px-3"
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setBundleToDelete(b); setDeleteOpen(true); }}
                            className="rounded-lg h-8 px-3 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {modalMode === 'create' ? 'Tambah Bundle Baru' : 'Edit Bundle'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-2">
            {/* Nama Bundle */}
            <div className="space-y-2">
              <Label htmlFor="bundleName">Nama Bundle *</Label>
              <Input
                id="bundleName"
                required
                placeholder="Contoh: Parsel Lebaran Premium"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            {/* Selected items */}
            {formData.items.length > 0 && (
              <div className="space-y-2">
                <Label>Produk Dipilih ({formData.items.length})</Label>
                <div className="space-y-2">
                  {formData.items.map((row) => {
                    const p = allProducts.find((x) => x.id === row.productId);
                    if (!p) return null;
                    const imgUrl = p.images?.[0]?.url;
                    return (
                      <div
                        key={row.productId}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-muted/30"
                      >
                        {imgUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imgUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{formatRupiah(Number(p.price))}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Label className="text-xs text-muted-foreground">Qty</Label>
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            value={row.quantity}
                            onChange={(e) => updateQty(row.productId, Number(e.target.value))}
                            className="w-16 h-8 text-center text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(row.productId)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Total preview */}
            {formData.items.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#28331F]/5 border border-[#28331F]/20">
                <span className="text-sm font-medium text-[#28331F]">Total Harga Bundle</span>
                <span className="text-lg font-bold text-[#28331F]">{formatRupiah(totalPreview)}</span>
              </div>
            )}

            {/* Product picker */}
            <div className="space-y-2">
              <Label>Tambah Produk ke Bundle</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari produk..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="max-h-52 overflow-y-auto rounded-xl border border-border/60 divide-y divide-border/40">
                {filteredProducts.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-6">
                    {productSearch ? 'Produk tidak ditemukan' : 'Semua produk sudah ditambahkan'}
                  </p>
                ) : (
                  filteredProducts.map((p) => {
                    const imgUrl = p.images?.[0]?.url;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => addProduct(p.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                      >
                        {imgUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imgUrl} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{formatRupiah(Number(p.price))}</p>
                        </div>
                        <Plus className="w-4 h-4 text-[#28331F] flex-shrink-0" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">
                Batal
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#28331F] hover:bg-[#28331F]/90 text-[#E7DCC3] rounded-xl"
              >
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {modalMode === 'edit' ? 'Simpan Perubahan' : 'Buat Bundle'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirm ── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Bundle?</AlertDialogTitle>
            <AlertDialogDescription>
              Bundle <strong>&quot;{bundleToDelete?.name}&quot;</strong> dan semua item di dalamnya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
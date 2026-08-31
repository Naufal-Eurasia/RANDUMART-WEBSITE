'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Loader2, ImageOff, ImagePlus, GalleryHorizontal } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PromoBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  position: number | null;
  isActive: boolean;
}

const EMPTY_FORM = { title: '', imageUrl: '', linkUrl: '', position: '' };

// ─── Component ────────────────────────────────────────────────────────────────
export default function PromosAdminPage() {
  const [promos, setPromos] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Delete confirm
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<PromoBanner | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/promos', { cache: 'no-store' });
      if (res.ok) setPromos(await res.json());
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
    setIsModalOpen(true);
  };

  const openEdit = (p: PromoBanner) => {
    setModalMode('edit');
    setEditingId(p.id);
    setFormData({
      title: p.title,
      imageUrl: p.imageUrl,
      linkUrl: p.linkUrl || '',
      position: p.position !== null ? String(p.position) : '',
    });
    setIsModalOpen(true);
  };

  // ── Upload gambar ──────────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: data });
      const result = await res.json();
      if (!res.ok) { toast.error(result.message || 'Gagal mengunggah gambar'); return; }
      setFormData((p) => ({ ...p, imageUrl: result.url }));
    } catch {
      toast.error('Kesalahan koneksi saat mengunggah');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error('Judul banner wajib diisi'); return; }
    if (!formData.imageUrl.trim()) { toast.error('Gambar banner wajib diisi'); return; }

    setSubmitting(true);
    try {
      const url = modalMode === 'edit' ? `/api/admin/promos/${editingId}` : '/api/admin/promos';
      const method = modalMode === 'edit' ? 'PUT' : 'POST';
      const posVal = String(formData.position).trim();
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          imageUrl: formData.imageUrl,
          linkUrl: formData.linkUrl || null,
          position: posVal ? parseInt(posVal, 10) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || 'Gagal menyimpan banner'); return; }
      toast.success(modalMode === 'edit' ? 'Banner berhasil diperbarui' : 'Banner berhasil dibuat (status Draft)');
      setIsModalOpen(false);
      fetchData();
    } catch {
      toast.error('Kesalahan koneksi');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle status Aktif/Draft ─────────────────────────────────────────────
  const handleToggle = async (promo: PromoBanner) => {
    try {
      const res = await fetch(`/api/admin/promos/${promo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !promo.isActive }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || 'Gagal mengubah status'); return; }
      setPromos((prev) => prev.map((p) => (p.id === promo.id ? { ...p, isActive: data.isActive } : p)));
      toast.success(data.isActive ? 'Banner diaktifkan' : 'Banner dinonaktifkan (Draft)');
    } catch {
      toast.error('Kesalahan koneksi');
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!promoToDelete) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/promos/${promoToDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) toast.error(data.message || 'Gagal menghapus');
      else { toast.success('Banner dihapus'); fetchData(); }
    } catch {
      toast.error('Kesalahan koneksi');
    } finally {
      setSubmitting(false);
      setDeleteOpen(false);
      setPromoToDelete(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Banner Promo</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola banner promo halaman depan. Banner baru berstatus Draft sampai diaktifkan.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-brand-green hover:bg-brand-greenHover text-brand-cream rounded-xl shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Banner
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
        </div>
      ) : promos.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground">
          <GalleryHorizontal className="w-12 h-12 opacity-40" />
          <p className="text-sm">Belum ada banner. Klik &quot;Tambah Banner&quot; untuk memulai.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border/60">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Banner</th>
                  <th className="text-center px-5 py-3 font-semibold text-muted-foreground">Urutan</th>
                  <th className="text-center px-5 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="text-center px-5 py-3 font-semibold text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {promos.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0 relative">
                          {p.imageUrl ? (
                            <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageOff className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-green">{p.title}</p>
                          {p.linkUrl && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{p.linkUrl}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-muted-foreground">
                      {p.position ?? '-'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Switch checked={p.isActive} onCheckedChange={() => handleToggle(p)} />
                        <Badge
                          variant={p.isActive ? 'default' : 'secondary'}
                          className={`rounded-full ${p.isActive ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
                        >
                          {p.isActive ? 'Aktif' : 'Draft'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(p)}
                          className="rounded-lg h-8 px-3"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setPromoToDelete(p); setDeleteOpen(true); }}
                          className="rounded-lg h-8 px-3 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {modalMode === 'create' ? 'Tambah Banner Baru' : 'Edit Banner'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="promoTitle">Judul Banner *</Label>
              <Input
                id="promoTitle"
                required
                placeholder="Contoh: Promo Kemerdekaan 17 Agustus"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promoImage">Gambar Banner *</Label>
              <div className="flex items-center gap-3">
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 relative border border-border/60">
                  {formData.imageUrl ? (
                    <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    id="promoImage"
                    required
                    placeholder="https://... atau unggah file"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg"
                  >
                    {uploading ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <ImagePlus className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Unggah Gambar
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promoLink">Link Tujuan (opsional)</Label>
              <Input
                id="promoLink"
                placeholder="/products atau https://..."
                value={formData.linkUrl}
                onChange={(e) => setFormData((p) => ({ ...p, linkUrl: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promoPosition">Urutan Tampil (opsional)</Label>
              <Input
                id="promoPosition"
                type="number"
                step="1"
                placeholder="0, 1, 2, ..."
                value={formData.position}
                onChange={(e) => setFormData((p) => ({ ...p, position: e.target.value }))}
              />
            </div>

            {modalMode === 'create' && (
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-xl px-3 py-2">
                Banner akan tersimpan sebagai <strong>Draft</strong>. Aktifkan melalui toggle di tabel setelah siap tayang.
              </p>
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">
                Batal
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-brand-green hover:bg-brand-greenHover text-brand-cream rounded-xl"
              >
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {modalMode === 'edit' ? 'Simpan Perubahan' : 'Buat Banner'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirm ── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Banner?</AlertDialogTitle>
            <AlertDialogDescription>
              Banner <strong>&quot;{promoToDelete?.title}&quot;</strong> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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

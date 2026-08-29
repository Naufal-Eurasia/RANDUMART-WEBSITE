'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Category { id: string; name: string; slug: string; emoji: string | null; _count?: { products: number }; }

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ id: '', name: '', slug: '', emoji: '' });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) setCategories(await res.json());
      else toast.error('Gagal mengambil data kategori');
    } catch (err) { toast.error('Terjadi kesalahan koneksi'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleNameChange = (val: string) => {
    if (modalMode === 'create') {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, name: val, slug: generatedSlug }));
    } else {
      setFormData(prev => ({ ...prev, name: val }));
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ id: '', name: '', slug: '', emoji: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setModalMode('edit');
    setFormData({ id: cat.id, name: cat.name, slug: cat.slug, emoji: cat.emoji || '' });
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (cat: Category) => {
    setCatToDelete(cat);
    setDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const isEdit = modalMode === 'edit';
    const url = isEdit ? `/api/admin/categories/${formData.id}` : '/api/admin/categories';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, slug: formData.slug, emoji: formData.emoji || null }),
      });
      const data = await res.json();
      if (!res.ok) toast.error(data.message || 'Gagal menyimpan kategori');
      else {
        toast.success(isEdit ? 'Kategori berhasil diubah' : 'Kategori berhasil ditambah');
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (err) { toast.error('Terjadi kesalahan koneksi'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!catToDelete) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/categories/${catToDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) toast.error(data.message || 'Gagal menghapus kategori');
      else { toast.success('Kategori berhasil dihapus'); fetchCategories(); }
    } catch (err) { toast.error('Terjadi kesalahan koneksi'); }
    finally { setSubmitting(false); setDeleteOpen(false); setCatToDelete(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Kategori Produk</h1>
          <p className="text-muted-foreground mt-1">Kelola kategori untuk mempermudah pencarian.</p>
        </div>
        <Button onClick={openCreateModal} className="bg-brand-emerald hover:bg-emerald-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Tambah Kategori
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-border/60 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Kategori</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold text-center">Jml Produk</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Memuat data kategori...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">Belum ada kategori.</td></tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg">{cat.emoji || '📁'}</div>
                        <span className="font-semibold text-foreground">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{cat.slug}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-muted rounded-full text-xs font-medium">{cat._count?.products || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(cat)} className="h-8 rounded-lg"><Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
                        <Button variant="outline" size="sm" onClick={() => openDeleteConfirm(cat)} className="h-8 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"><Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader><DialogTitle className="font-display text-xl">{modalMode === 'create' ? 'Tambah Kategori Baru' : 'Edit Kategori'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2"><Label htmlFor="name">Nama Kategori</Label><Input id="name" required value={formData.name} onChange={(e) => handleNameChange(e.target.value)} className="rounded-xl" placeholder="Contoh: Bodycare" /></div>
            <div className="space-y-2"><Label htmlFor="slug">Slug (URL)</Label><Input id="slug" required value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="rounded-xl" placeholder="contoh: bodycare" /><p className="text-[10px] text-muted-foreground">Otomatis digenerate dari nama, tapi bisa diedit manual. Harus unik.</p></div>
            <div className="space-y-2"><Label htmlFor="emoji">Emoji (Opsional)</Label><Input id="emoji" value={formData.emoji} onChange={(e) => setFormData({...formData, emoji: e.target.value})} className="rounded-xl" placeholder="Contoh: ✨" /></div>
            <DialogFooter className="pt-4"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Batal</Button><Button type="submit" disabled={submitting} className="rounded-xl bg-brand-emerald hover:bg-emerald-700 text-white">{submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Simpan Kategori</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kategori {catToDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan. Kategori hanya bisa dihapus jika tidak ada produk yang terkait dengannya.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting} className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDelete(); }} disabled={submitting} className="rounded-xl bg-red-600 hover:bg-red-700 text-white">{submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Ya, Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, Plus, Edit2, Trash2, PowerOff, Image as ImageIcon, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { formatRupiah } from '@/lib/categories';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [prodToDelete, setProdToDelete] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    id: '', name: '', slug: '', description: '', price: '', originalPrice: '', discount: '',
    stock: '', categoryId: '', isBestSeller: false, isNew: false, isPublished: true, tagsStr: ''
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([fetch('/api/admin/products', { cache: 'no-store' }), fetch('/api/admin/categories', { cache: 'no-store' })]);
      if (pRes.ok && cRes.ok) {
        setProducts(await pRes.json());
        setCategories(await cRes.json());
      }
    } catch (err) { toast.error('Terjadi kesalahan koneksi'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleNameChange = (val: string) => {
    if (modalMode === 'create') {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData((prev: any) => ({ ...prev, name: val, slug: generatedSlug }));
    } else {
      setFormData((prev: any) => ({ ...prev, name: val }));
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ id: '', name: '', slug: '', description: '', price: '', originalPrice: '', discount: '', stock: '', categoryId: categories[0]?.id || '', isBestSeller: false, isNew: false, isPublished: true, tagsStr: '' });
    setImageFiles([]);
    setUploadedImages([]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setModalMode('edit');
    setFormData({
      id: p.id, name: p.name, slug: p.slug, description: p.description, price: p.price, originalPrice: p.originalPrice || '', discount: p.discount || '',
      stock: p.stock, categoryId: p.categoryId, isBestSeller: p.isBestSeller, isNew: p.isNew, isPublished: p.isPublished, tagsStr: p.tags?.join(', ') || ''
    });
    setImageFiles([]);
    setUploadedImages(p.images || []);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeFile = (idx: number) => setImageFiles(prev => prev.filter((_, i) => i !== idx));
  const removeUploaded = (idx: number) => setUploadedImages(prev => prev.filter((_, i) => i !== idx));

  const uploadImagesToCloudinary = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of imageFiles) {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: data });
      if (res.ok) {
        const json = await res.json();
        urls.push(json.url);
      }
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newImgUrls = await uploadImagesToCloudinary();
      const allImgUrls = [...uploadedImages.map(img => img.url), ...newImgUrls];

      if (allImgUrls.length === 0 && modalMode === 'create') {
        toast.error('Minimal 1 gambar produk diperlukan');
        setSubmitting(false);
        return;
      }

      const tagsArray = formData.tagsStr.split(',').map((t: string) => t.trim()).filter(Boolean);

      const calculatedDiscount = formData.originalPrice && Number(formData.originalPrice) > Number(formData.price)
        ? Math.floor(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)
        : null;

      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        discount: calculatedDiscount,
        stock: Number(formData.stock),
        categoryId: formData.categoryId,
        isBestSeller: formData.isBestSeller,
        isNew: formData.isNew,
        isPublished: formData.isPublished,
        tags: tagsArray,
        imageUrls: allImgUrls
      };

      const url = modalMode === 'edit' ? `/api/admin/products/${formData.id}` : '/api/admin/products';
      const method = modalMode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();

      if (!res.ok) toast.error(data.message || 'Gagal menyimpan produk');
      else {
        toast.success(modalMode === 'edit' ? 'Produk berhasil diubah' : 'Produk berhasil ditambah');
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) { toast.error('Terjadi kesalahan koneksi'); }
    finally { setSubmitting(false); }
  };

  const handleTogglePublish = async (p: any) => {
    setSubmitting(true);
    try {
      const payload = { ...p, isPublished: !p.isPublished, originalPrice: p.originalPrice || null, discount: p.discount || null };
      const res = await fetch(`/api/admin/products/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { toast.success(`Produk di${p.isPublished ? 'nonaktifkan' : 'aktifkan'}`); fetchData(); }
      else toast.error('Gagal merubah status');
    } catch (err) { toast.error('Kesalahan koneksi'); } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!prodToDelete) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/products/${prodToDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) toast.error(data.message || 'Gagal menghapus produk');
      else { toast.success('Produk dihapus'); fetchData(); }
    } catch (err) { toast.error('Kesalahan koneksi'); }
    finally { setSubmitting(false); setDeleteOpen(false); setProdToDelete(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold">Data Produk</h1>
        <Button onClick={openCreateModal} className="bg-brand-emerald hover:bg-emerald-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Tambah Produk
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-border/60 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
              <tr>
                <th className="px-6 py-4 font-semibold">Produk</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="px-6 py-4 font-semibold">Stok</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? <tr><td colSpan={5} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr> :
                products.map(p => {
                  const hasOrders = (p._count?.orderItems || 0) > 0;
                  return (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? <img src={p.images[0].url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 bg-muted rounded-lg" />}
                        <div>
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-emerald">{formatRupiah(Number(p.price))}</td>
                    <td className="px-6 py-4">{p.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        {p.isPublished ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleTogglePublish(p)} disabled={submitting} title="Aktif/Nonaktif">
                          <PowerOff className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditModal(p)}><Edit2 className="w-3.5 h-3.5" /></Button>
                        <Button variant="outline" size="sm" onClick={() => { setProdToDelete(p); setDeleteOpen(true); }} className="text-red-600 hover:bg-red-50 border-red-200">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )})}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader><DialogTitle className="font-display text-xl">{modalMode === 'create' ? 'Tambah Produk' : 'Edit Produk'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama Produk *</Label><Input required value={formData.name} onChange={e => handleNameChange(e.target.value)} /></div>
              <div className="space-y-2"><Label>Slug *</Label><Input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></div>
            </div>

            <div className="space-y-2"><Label>Deskripsi *</Label><Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Harga Akhir (Rp) *</Label><Input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
              <div className="space-y-2"><Label>Harga Coret</Label><Input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} placeholder="Opsional" /></div>
              <div className="space-y-2"><Label>Stok *</Label><Input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} /></div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori *</Label>
                <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="" disabled>Pilih Kategori</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2"><Label>Tags (pisahkan koma)</Label><Input value={formData.tagsStr} onChange={e => setFormData({...formData, tagsStr: e.target.value})} placeholder="jerawat, sensitif" /></div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm"><Checkbox checked={formData.isBestSeller} onCheckedChange={v => setFormData({...formData, isBestSeller: !!v})} /> Best Seller</label>
              <label className="flex items-center gap-2 text-sm"><Checkbox checked={formData.isNew} onCheckedChange={v => setFormData({...formData, isNew: !!v})} /> Produk Baru</label>
            </div>

            {/* Upload Area */}
            <div className="space-y-3">
              <Label>Gambar Produk</Label>
              <div className="flex flex-wrap gap-3">
                {uploadedImages.map((img, i) => (
                  <div key={img.id} className="relative w-20 h-20 border rounded-xl overflow-hidden">
                    <img src={img.url} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeUploaded(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3"/></button>
                  </div>
                ))}
                {imageFiles.map((f, i) => (
                  <div key={i} className="relative w-20 h-20 border rounded-xl overflow-hidden">
                    <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3"/></button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted text-muted-foreground">
                  <ImageIcon className="w-5 h-5 mb-1" />
                  <span className="text-[10px]">Upload</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <DialogFooter><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button><Button type="submit" disabled={submitting} className="bg-brand-emerald text-white">{submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}Simpan Produk</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Hapus Produk</AlertDialogTitle><AlertDialogDescription>{(prodToDelete?._count?.orderItems || 0) > 0 ? "Produk ini punya riwayat transaksi! Disarankan 'Nonaktifkan' saja via tombol ⏻ di tabel." : "Yakin ingin menghapus produk secara permanen?"}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel><AlertDialogAction onClick={handleDelete} disabled={submitting} className="bg-red-600 text-white hover:bg-red-700">Ya, Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
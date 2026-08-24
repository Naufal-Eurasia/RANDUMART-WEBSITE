'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, Plus, Edit2, Trash2, PowerOff, Image as ImageIcon, X, Search, Filter, Eye } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { formatRupiah } from '@/lib/categories';
import { Badge } from '@/components/ui/badge';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

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
      id: p.id, name: p.name, slug: p.slug, description: p.description,
      price: String(Math.round(Number(p.price))),
      originalPrice: p.originalPrice ? String(Math.round(Number(p.originalPrice))) : '',
      discount: p.discount || '',
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

  // Preview Diskon Kalkulator
  const previewDiscount = formData.originalPrice && Number(formData.originalPrice) > Number(formData.price)
    ? Math.floor(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)
    : 0;

  // Terapkan filter
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || p.categoryId === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || (filterStatus === 'PUBLISHED' ? p.isPublished : !p.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-display font-bold">Data Produk</h1>
        <Button onClick={openCreateModal} className="bg-[#28331F] hover:bg-[#28331F]/90 text-[#E7DCC3] rounded-xl shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Tambah Produk
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-border/60 shadow-soft">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-50/50"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-10 px-3 py-2 bg-gray-50/50 border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex-1 sm:w-48"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 px-3 py-2 bg-gray-50/50 border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex-1 sm:w-32"
          >
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">Aktif</option>
            <option value="DRAFT">Nonaktif</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border/60 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 text-muted-foreground border-b border-border/60">
              <tr>
                <th className="px-6 py-4 font-semibold">Produk</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="px-6 py-4 font-semibold text-center">Stok</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? <tr><td colSpan={5} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#B8791F]" /></td></tr> :
                filteredProducts.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Tidak ada produk ditemukan</td></tr> :
                filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? <Image src={p.images[0].url} alt={p.name} width={40} height={40} className="w-10 h-10 rounded-lg object-contain bg-[#FBF8F2] border border-border/50" /> : <div className="w-10 h-10 bg-muted rounded-lg border border-border/50 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground/50"/></div>}
                        <div>
                          <p className="font-semibold text-[#28331F] flex items-center gap-2">
                            {p.name}
                            {p.isBestSeller && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-[#B8791F]/10 text-[#B8791F]">Best</Badge>}
                          </p>
                          <p className="text-xs text-muted-foreground">{p.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-[#28331F]">{formatRupiah(Number(p.price))}</span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-muted-foreground line-through">{formatRupiah(Number(p.originalPrice))}</span>
                            <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded font-bold">{p.discount}%</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={p.stock === 0 ? 'destructive' : 'outline'} className={`
                        ${p.stock === 0 ? 'font-bold' : ''}
                        ${p.stock > 0 && p.stock <= 5 ? 'bg-amber-100 text-amber-700 border-transparent font-bold' : ''}
                        ${p.stock > 5 ? 'bg-emerald-50 text-emerald-700 border-transparent' : ''}
                      `}>
                        {p.stock === 0 ? 'Habis' : p.stock <= 5 ? `Sisa ${p.stock}` : p.stock}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.isPublished ? 'bg-[#E7DCC3] text-[#28331F]' : 'bg-gray-100 text-gray-500'}`}>
                        {p.isPublished ? 'AKTIF' : 'NONAKTIF'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleTogglePublish(p)} disabled={submitting} title={p.isPublished ? 'Nonaktifkan' : 'Aktifkan'} className="h-8 w-8 p-0 rounded-lg">
                          <PowerOff className={`w-3.5 h-3.5 ${p.isPublished ? 'text-amber-600' : 'text-emerald-600'}`} />
                        </Button>
                        <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg text-[#28331F] hover:bg-[#E7DCC3]/50 border-border/50" title="Lihat Detail">
                          <Link href={`/admin/products/${p.id}`}>
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditModal(p)} className="h-8 w-8 p-0 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => { setProdToDelete(p); setDeleteOpen(true); }} className="h-8 w-8 p-0 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD Produk */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader><DialogTitle className="font-display text-xl">{modalMode === 'create' ? 'Tambah Produk' : 'Edit Produk'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama Produk *</Label><Input required value={formData.name} onChange={e => handleNameChange(e.target.value)} /></div>
              <div className="space-y-2"><Label>Slug *</Label><Input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></div>
            </div>

            <div className="space-y-2"><Label>Deskripsi *</Label><Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="min-h-[100px]" /></div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Harga Akhir (Rp) *</Label><Input type="number" required min="0" step="1" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
              <div className="space-y-2">
                <Label>Harga Coret</Label>
                <Input type="number" min="0" step="1" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} placeholder="Opsional" />
                {previewDiscount > 0 && (
                  <p className="text-[10px] text-[#B8791F] font-medium mt-1">
                    Diskon {previewDiscount}% (Tampil: {formatRupiah(Number(formData.price))} <span className="line-through opacity-60">{formatRupiah(Number(formData.originalPrice))}</span>)
                  </p>
                )}
              </div>
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

            <div className="flex gap-6 bg-gray-50 p-4 rounded-xl border border-border/50">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer"><Checkbox checked={formData.isBestSeller} onCheckedChange={v => setFormData({...formData, isBestSeller: !!v})} /> Best Seller</label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer"><Checkbox checked={formData.isNew} onCheckedChange={v => setFormData({...formData, isNew: !!v})} /> Produk Baru</label>
            </div>

            {/* Upload Area */}
            <div className="space-y-3">
              <Label>Gambar Produk</Label>
              <div className="flex flex-wrap gap-3">
                {uploadedImages.map((img, i) => (
                  <div key={img.id} className="relative w-20 h-20 border rounded-xl overflow-hidden group">
                    <Image src={img.url} alt="Uploaded product image" width={80} height={80} className="w-full h-full object-contain bg-[#FBF8F2]" />
                    <button type="button" onClick={() => removeUploaded(i)} className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3"/></button>
                  </div>
                ))}
                {imageFiles.map((f, i) => (
                  <div key={i} className="relative w-20 h-20 border rounded-xl overflow-hidden group">
                    <Image src={URL.createObjectURL(f)} alt="Local product image preview" width={80} height={80} className="w-full h-full object-contain bg-[#FBF8F2]" />
                    <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3"/></button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-gray-400 text-gray-400 transition-colors">
                  <ImageIcon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">Upload</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border/50">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
              <Button type="submit" disabled={submitting} className="bg-[#28331F] text-[#E7DCC3] hover:bg-[#28331F]/90 rounded-xl px-6">
                {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}Simpan Produk
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader><AlertDialogTitle>Hapus Produk</AlertDialogTitle><AlertDialogDescription>{(prodToDelete?._count?.orderItems || 0) > 0 ? "Produk ini punya riwayat transaksi! Disarankan 'Nonaktifkan' saja via tombol ⏻ di tabel agar data pesanan lama tidak rusak." : "Yakin ingin menghapus produk secara permanen?"}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={submitting} className="rounded-xl">Batal</AlertDialogCancel><AlertDialogAction onClick={handleDelete} disabled={submitting} className="bg-red-600 text-white hover:bg-red-700 rounded-xl">Ya, Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

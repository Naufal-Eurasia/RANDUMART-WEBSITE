'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Settings } from 'lucide-react';

export default function SettingsAdminPage() {
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setWhatsapp(data.whatsappNumber);
        }
      } catch (err) {
        toast.error('Gagal memuat pengaturan toko');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsappNumber: whatsapp })
      });
      if (res.ok) {
        toast.success('Pengaturan berhasil disimpan');
      } else {
        toast.error('Gagal menyimpan pengaturan');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold">Pengaturan Toko</h1>
        <p className="text-muted-foreground mt-1">Konfigurasi global untuk operasional toko.</p>
      </div>

      <div className="bg-white rounded-3xl border border-border/60 shadow-soft p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Settings className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold font-display">Kontak & Operasional</h2>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="wa">Nomor WhatsApp Konfirmasi (Admin)</Label>
              <Input 
                id="wa" 
                value={whatsapp} 
                onChange={(e) => setWhatsapp(e.target.value)} 
                placeholder="6281234567890" 
                required 
                className="max-w-md"
              />
              <p className="text-xs text-muted-foreground">
                Gunakan format internasional tanpa tanda plus (+). Contoh: 6281234567890.<br/>
                Nomor ini akan digunakan sebagai tujuan tombol "Konfirmasi Pembayaran" oleh pelanggan.
              </p>
            </div>

            <Button type="submit" disabled={saving} className="bg-brand-emerald hover:bg-emerald-700 text-white rounded-xl">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Simpan Pengaturan
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

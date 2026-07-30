'use client';

import { useState } from 'react';
import { signIn, getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        toast.error('Email atau password salah');
      } else {
        const session = await getSession();
        if (session?.user?.role !== 'ADMIN') {
          toast.error('Akun ini tidak memiliki akses admin');
          await signOut({ redirect: false });
          setLoading(false);
          return;
        }

        toast.success('Login berhasil');
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-soft border border-border/60 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-brand-emerald mb-2">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">Silakan login untuk mengelola toko</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="rounded-xl"
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="rounded-xl"
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-11 mt-4 rounded-xl bg-brand-emerald hover:bg-emerald-700 text-white font-semibold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}

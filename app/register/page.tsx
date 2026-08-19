"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const register = useStore((state) => state.register);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = email.split('@')[0].replace(/\.[^/.]+$/, '');
    register({ email, name: name.charAt(0).toUpperCase() + name.slice(1) });
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-slate-50 py-16">
      <div className="w-full max-w-md rounded-[28px] border border-border bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-emerald font-semibold">Buat akun baru</p>
          <h1 className="text-3xl font-bold text-foreground">Register</h1>
          <p className="text-sm text-muted-foreground">
            Isi data berikut untuk membuat akun dan mulai belanja produk herbal kami.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@contoh.com"
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Kata Sandi</Label>
            <Input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimal 8 karakter"
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-confirm-password">Konfirmasi Kata Sandi</Label>
            <Input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Ulangi kata sandi Anda"
              required
              className="bg-background"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-brand-emerald hover:bg-emerald-700 text-white py-3"
            style={{ backgroundColor: '#047857' }}
          >
            Register
          </Button>
        </form>

        {submitted && (
          <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-800">
            Pendaftaran berhasil (demo). Silakan login untuk melanjutkan.
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-brand-emerald hover:text-emerald-700">
            Masuk Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const login = useStore((state) => state.login);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = email.split('@')[0].replace(/\.[^/.]+$/, '');
    login({ email, name: name.charAt(0).toUpperCase() + name.slice(1) });
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-slate-50 py-16">
      <div className="w-full max-w-md rounded-[28px] border border-border bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-emerald font-semibold">Masuk ke akun Anda</p>
          <h1 className="text-3xl font-bold text-foreground">Login</h1>
          <p className="text-sm text-muted-foreground">
            Masukkan email dan kata sandi Anda untuk melanjutkan belanja di Randumart.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@contoh.com"
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Kata Sandi</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan kata sandi Anda"
              required
              className="bg-background"
            />
          </div>

          <Button type="submit" className="w-full rounded-full bg-brand-emerald hover:bg-emerald-700 text-white py-3">
            Login
          </Button>
        </form>

        {submitted && (
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Login berhasil (demo). Anda bisa lanjutkan ke halaman produk.
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Belum punya akun?{' '}
          <Link href="/register" className="font-semibold text-brand-emerald hover:text-emerald-700">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}

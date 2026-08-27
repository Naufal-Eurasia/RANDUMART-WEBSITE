'use client';

import { useEffect, useState } from 'react';
import { Category } from '@/lib/types';
import { getCategoryVisual } from '@/lib/categories';

interface DbCategory {
  id: string;
  slug: string;
  name: string;
  productCount: number;
  image: string | null;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: DbCategory[]) => {
        if (!active) return;
        // Kategori tanpa produk terbit disembunyikan: kalau diklik hasilnya
        // halaman kosong. Filter dulu sebelum map supaya indeks warna rapat.
        const merged: Category[] = data
          .filter((c) => c.productCount > 0)
          .map((c, i) => ({
            id: c.id,
            slug: c.slug,
            name: c.name,
            productCount: c.productCount,
            description: `Koleksi ${c.name} pilihan terbaik untuk kebutuhan Anda.`,
            image: c.image,
            // Hanya warna/gradien/aksen — gambar datang dari DB di atas.
            ...getCategoryVisual(i),
          }));
        setCategories(merged);
      })
      .catch(() => {
        if (active) setCategories([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { categories, loading };
}

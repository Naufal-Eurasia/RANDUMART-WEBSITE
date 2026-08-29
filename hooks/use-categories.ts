'use client';

import { useEffect, useState } from 'react';
import { Category } from '@/lib/types';
import { getCategoryVisual } from '@/lib/categories';

interface DbCategory {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  productCount: number;
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
        const merged: Category[] = data.map((c, i) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          emoji: c.emoji,
          productCount: c.productCount,
          description: `Koleksi ${c.name} pilihan terbaik untuk kebutuhan Anda.`,
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

import { Concern } from './types';

// Categories now come from the database (see app/api/categories/route.ts and
// hooks/use-categories.ts) — this file only keeps decorative fallbacks for
// visual fields (color/gradient/accent) that don't exist on the Category
// model, since the DB category list can grow/change at any time.
// Gambar TIDAK lagi di sini: kartu memakai foto produk asli dari API.
const visualPalette = [
  { color: '#1a4c1b', gradient: 'from-green-900/90 via-green-800/40 to-transparent', accent: 'green' },
  { color: '#DB2777', gradient: 'from-pink-900/90 via-pink-700/40 to-transparent', accent: 'pink' },
  { color: '#7C3AED', gradient: 'from-violet-900/90 via-violet-700/40 to-transparent', accent: 'violet' },
  { color: '#D97706', gradient: 'from-amber-900/90 via-amber-700/40 to-transparent', accent: 'amber' },
  { color: '#0891B2', gradient: 'from-cyan-900/90 via-cyan-700/40 to-transparent', accent: 'cyan' },
  { color: '#2563EB', gradient: 'from-blue-900/90 via-blue-700/40 to-transparent', accent: 'blue' },
  { color: '#059669', gradient: 'from-teal-900/90 via-teal-700/40 to-transparent', accent: 'teal' },
  { color: '#EA580C', gradient: 'from-orange-900/90 via-orange-700/40 to-transparent', accent: 'orange' },
  { color: '#9333EA', gradient: 'from-fuchsia-900/90 via-fuchsia-700/40 to-transparent', accent: 'fuchsia' },
];

export function getCategoryVisual(index: number) {
  return visualPalette[index % visualPalette.length];
}

export const concerns: Concern[] = [
  { slug: 'acne', name: 'Acne', color: 'from-rose-500 to-pink-500', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop' },
  { slug: 'brightening', name: 'Brightening', color: 'from-amber-400 to-yellow-500', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop' },
  { slug: 'anti-aging', name: 'Anti Aging', color: 'from-violet-500 to-purple-500', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop' },
  { slug: 'hair-care', name: 'Hair Care', color: 'from-cyan-500 to-blue-500', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop' },
  { slug: 'immunity', name: 'Immunity', color: 'from-emerald-500 to-green-500', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop' },
  { slug: 'weight-management', name: 'Weight Management', color: 'from-teal-500 to-cyan-500', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop' },
];

// Label menu seragam bahasa Indonesia. 'Brand Ambassador' & 'FAQ' dibiarkan
// karena keduanya lazim dipakai apa adanya di pasar lokal.
export const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Produk', href: '/products' },
  { label: 'Kategori', href: '/#categories', mega: true },
  { label: 'Brand Ambassador', href: '/#ambassador' },
  { label: 'Promo', href: '/#promo' },
  { label: 'Artikel', href: '/#blog' },
  { label: 'Tentang Kami', href: '/#about' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Kontak', href: '/#contact' },
];

export const formatRupiah = (n: number | string | undefined | null) => {
  if (n === null || n === undefined || isNaN(Number(n))) return 'Rp0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n));
};

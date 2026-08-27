export type Badge = 'best-seller' | 'new-arrival' | 'limited' | 'official' | 'bpom' | 'halal' | 'out-of-stock';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCount: number;
  // null kalau kategori belum punya produk terbit berfoto — kartu jatuh ke warna brand.
  image: string | null;
  color: string;
  gradient: string;
  accent: string;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images: { url: string }[];
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  benefits: string[];
  ingredients: string;
  usage: string;
  bpom: string;
  halal: boolean;
  stock: number;
  tags: string[];
  badges: Badge[];
  reviews: Review[];
  bestSeller?: boolean;
  isNew?: boolean;
  limited?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
  product: string;
}

export interface Concern {
  slug: string;
  name: string;
  color: string;
  image: string;
}

export type Badge = 'best-seller' | 'new-arrival' | 'limited' | 'official' | 'bpom' | 'halal' | 'out-of-stock';

export interface Category {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  productCount: number;
  image: string;
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
  images: string[];
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
  emoji: string;
  color: string;
  image: string;
}

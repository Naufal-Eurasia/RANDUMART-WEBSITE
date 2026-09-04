import { NextResponse } from 'next/server';
import { getCachedBundles } from '@/lib/bundle-queries';

export const revalidate = 3600;

// GET /api/bundles — publik, tanpa auth. Dipakai halaman /products untuk
// menampilkan section "Paket Parsel & Bundling" ke customer.
export async function GET() {
  try {
    const bundles = await getCachedBundles();
    return NextResponse.json(bundles);
  } catch (error) {
    console.error('GET /api/bundles error:', error);
    return NextResponse.json({ message: 'Error fetching bundles' }, { status: 500 });
  }
}

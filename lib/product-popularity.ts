import { prisma } from '@/lib/prisma';

// Order yang sudah dibayar tapi belum terkirim (PAID) tetap dihitung sebagai
// penjualan nyata, bukan cuma yang sudah COMPLETED — supaya toko baru dengan
// order yang baru saja lunas tidak terlihat sepi di "Most Popular".
const SALES_COUNTED_STATUSES = ['PAID', 'COMPLETED'] as const;

// Prisma tidak bisa orderBy langsung ke agregasi relasi (OrderItem.quantity)
// lewat findMany biasa, jadi total penjualan per produk diambil terpisah lalu
// dipakai untuk mengurutkan produk secara manual.
export async function getProductSalesMap(): Promise<Map<string, number>> {
  const sales = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: { order: { status: { in: [...SALES_COUNTED_STATUSES] } } },
    _sum: { quantity: true },
  });

  return new Map(sales.map((s) => [s.productId, s._sum.quantity ?? 0]));
}

type PopularityFields = { id: string; isBestSeller: boolean; reviewCount: number };

// Diurutkan berdasarkan total quantity terjual (desc). Produk yang belum
// punya penjualan (atau saat agregasi kosong sama sekali, mis. toko baru)
// jatuh ke fallback: best seller dulu, baru review terbanyak.
export function sortByPopularity<T extends PopularityFields>(products: T[], salesMap: Map<string, number>): T[] {
  return [...products].sort((a, b) => {
    const salesDiff = (salesMap.get(b.id) ?? 0) - (salesMap.get(a.id) ?? 0);
    if (salesDiff !== 0) return salesDiff;

    const bestSellerDiff = Number(b.isBestSeller) - Number(a.isBestSeller);
    if (bestSellerDiff !== 0) return bestSellerDiff;

    return b.reviewCount - a.reviewCount;
  });
}

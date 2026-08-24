import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, BadgeCheck } from 'lucide-react';
import { formatRupiah } from '@/lib/categories';
import { Badge } from '@/components/ui/badge';

export default async function AdminProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: true, category: true },
  });

  if (!product) return notFound();

  const primaryImage = product.images.find((img: any) => img.isPrimary)?.url || product.images[0]?.url || '/placeholder.jpg';
  const otherImages = product.images.filter((img: any) => img.url !== primaryImage);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <h1 className="text-2xl font-display font-bold">Detail Produk</h1>
      </div>

      <div className="bg-[#E7DCC3]/20 border border-[#E7DCC3] rounded-3xl p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Gallery Area */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-border/50">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-contain bg-[#FBF8F2]"
              />
            </div>
            {otherImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {otherImages.map((img: any) => (
                  <div key={img.id} className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-border/50 shrink-0">
                    <Image src={img.url} alt="Gallery" fill className="object-contain bg-[#FBF8F2]" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Area */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-white">{product.category.name}</Badge>
                {product.isPublished ? (
                  <Badge className="bg-[#28331F] text-[#E7DCC3]">Aktif</Badge>
                ) : (
                  <Badge variant="secondary">Nonaktif</Badge>
                )}
              </div>
              <h2 className="text-3xl font-display font-bold text-[#28331F]">{product.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">Slug: {product.slug}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-border/50 shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">Harga Final</p>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-bold text-[#B8791F]">{formatRupiah(Number(product.price))}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm line-through text-muted-foreground">{formatRupiah(Number(product.originalPrice))}</span>
                    <Badge variant="destructive" className="h-5 px-1.5 text-[10px] bg-red-100 text-red-700 hover:bg-red-100 border-none">-{product.discount}%</Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Stok Tersedia</p>
                <p className={`text-xl font-bold ${product.stock === 0 ? 'text-red-500' : 'text-[#28331F]'}`}>
                  {product.stock} {product.stock === 0 && '(Habis)'}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Statistik</p>
                <p className="text-sm font-medium text-[#28331F]">⭐ {product.rating} ({product.reviewCount} ulasan)</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-[#28331F]">Highlight & Badge</h3>
              <div className="flex flex-wrap gap-2">
                {product.isBestSeller && <Badge className="bg-amber-500 text-white border-none hover:bg-amber-500">Best Seller</Badge>}
                {product.isNew && <Badge className="bg-emerald-600 text-white border-none hover:bg-emerald-600">Produk Baru</Badge>}
                {product.tags.map((t: string) => <Badge key={t} variant="outline" className="bg-white">{t}</Badge>)}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-[#28331F]">Deskripsi Lengkap</h3>
              <div className="p-4 rounded-2xl bg-white border border-border/50 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {product.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

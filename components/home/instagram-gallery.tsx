import Image from 'next/image';
import { Instagram, Heart } from 'lucide-react';
import { getCatalogGalleryImages } from '@/lib/catalog-images';

export function InstagramGallery() {
  const images = getCatalogGalleryImages();
  return (
    <section className="py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-sm font-semibold mb-3">
            <Instagram className="w-4 h-4" /> @randumartherbal
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Ikuti Kami di Instagram</h2>
          <p className="mt-2 text-muted-foreground">Inspo gaya hidup sehat & kecantikan alami.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {images.length > 0 ? (
            images.map((src, i) => (
              <div key={src} className="group relative aspect-square rounded-2xl overflow-hidden bg-muted">
                <Image
                  src={src}
                  alt={`Katalog produk ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors grid place-items-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-white text-sm font-semibold">
                    <Heart className="w-5 h-5 fill-white" /> 1.2K
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-muted-foreground/30 p-8 text-center text-muted-foreground">
              Belum ada gambar katalog produk yang tersedia.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

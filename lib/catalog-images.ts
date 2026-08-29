import { readdirSync } from 'fs';
import path from 'path';

const catalogImagesDirectory = path.join(process.cwd(), 'public', 'images', 'katalog produk');

export function getCatalogGalleryImages() {
  try {
    const files = readdirSync(catalogImagesDirectory)
      .filter((file) => /\.(png|jpe?g|webp|gif|svg)$/i.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    return files.map((file) => `/images/katalog%20produk/${encodeURIComponent(file)}`);
  } catch {
    return [];
  }
}

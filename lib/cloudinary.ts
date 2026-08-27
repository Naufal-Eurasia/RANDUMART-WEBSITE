// Foto produk yang diunggah admin rata-rata 538 KB. Diukur 27 Agu 2026:
// 85 gambar katalog = 43,6 MB mentah, dan next.config.js menyetel
// images.unoptimized sehingga next/image tidak me-resize apa pun.
// Menyisipkan transformasi ke URL Cloudinary adalah satu-satunya tuas
// yang tersedia — 557 KB turun jadi 19 KB pada gambar yang sama.
//
// Tanpa `h`: c_limit — gambar diperkecil sampai muat lebar `w` tanpa
// dipotong. Ini yang dipakai kartu & galeri produk, karena kartunya
// object-contain: memotong justru membuang bagian produknya.
// Dengan `h`: c_fill + g_auto — dipotong ke rasio pasti, dipakai foto
// latar kategori yang memang object-cover.
//
// ponytail: hanya menangani host Cloudinary. URL dari host lain
// dikembalikan apa adanya, jadi aman dipanggil di jalur mana pun.
export function cdn(url: string | null | undefined, w: number, h?: number): string | null {
  if (!url) return null;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  const crop = h ? `,h_${h},c_fill,g_auto` : ',c_limit';
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${w}${crop}/`);
}

// Lebar yang benar-benar dipakai UI. Dinamai supaya pemanggil tidak
// menebak angka: kartu 400px cukup untuk grid 4 kolom di layar retina,
// galeri detail 900px untuk zoom.
export const IMG_CARD = 400;
export const IMG_GALLERY = 900;

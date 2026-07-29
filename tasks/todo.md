- [x] Fase 1: Setup Database & Skema
- [x] Fase 2: Setup Autentikasi (NextAuth) - backend only
- [x] Fase Migrasi: Basis project dipindah ke RANDUMART-WEBSITE
- [x] Fase 3: Katalog Produk terhubung Prisma Neon
- [x] Fase 4: Checkout & Konfirmasi Order terhubung API
- [ ] Fase 5: Admin Panel & Media (Cloudinary) - PRIORITAS SEKARANG
  - [ ] Halaman /login sederhana (email+password, TIDAK perlu halaman register terpisah - akun admin dibuat manual lewat Prisma Studio)
  - [ ] Dashboard admin (proteksi role ADMIN, middleware sudah ada dari Fase 2)
  - [ ] CRUD Produk + upload gambar ke Cloudinary
  - [ ] CRUD Kategori
  - [ ] Kelola Order (lihat daftar & update status manual)
- [ ] Fase 6: Checkout ke WhatsApp (ganti tombol "Bayar Sekarang" di order-confirmation jadi "Konfirmasi via WhatsApp")
- [ ] Fase 7: Pembayaran Midtrans (ditunda)
- [ ] Fase 8: Halaman Akun Customer (Register UI, Riwayat Order untuk customer yang login) - ditunda

## Item optimasi (tidak blocking)
- [ ] Optimasi Wishlist Fetch: ganti fetch semua produk menjadi endpoint khusus ?ids=a,b,c ketika katalog sudah besar
- [ ] Ganti `ProductData = any` menjadi `Prisma.ProductGetPayload` di app/products/page.tsx
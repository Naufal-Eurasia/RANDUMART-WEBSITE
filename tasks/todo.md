- [x] Fase 1: Setup Database & Skema
- [x] Fase 2: Setup Autentikasi (NextAuth) - backend only
- [x] Fase Migrasi: Basis project dipindah ke RANDUMART-WEBSITE
- [x] Fase 3: Katalog Produk terhubung Prisma Neon
- [x] Fase 4: Checkout & Konfirmasi Order terhubung API
- [ ] Fase 5: Integrasi Pembayaran (Midtrans) - Snap Token + Webhook
- [ ] Fase 6: Halaman Akun (Login/Register UI, Riwayat Order untuk user login)
- [ ] Fase 7: Admin Panel & Media (Cloudinary)

## Item optimasi (tidak blocking, dikerjakan kapan saja ada waktu)
- [ ] Optimasi Wishlist Fetch: ganti fetch semua produk menjadi endpoint khusus ?ids=a,b,c ketika katalog sudah besar (> ratusan produk)
- [ ] Ganti `ProductData = any` menjadi `Prisma.ProductGetPayload` (dengan include images/category) di app/products/page.tsx
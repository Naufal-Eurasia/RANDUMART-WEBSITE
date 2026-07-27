
- [ ] Optimasi Wishlist Fetch: Ganti pendekatan fetch semua produk menjadi pemanggilan endpoint khusus ?ids=a,b,c ketika data katalog sudah besar (> ratusan produk), untuk menghemat payload API.
- [ ] Ganti \`ProductData = any\` menjadi \`Prisma.ProductGetPayload\` (dengan referensi include images/category) di \`app/products/page.tsx\`.

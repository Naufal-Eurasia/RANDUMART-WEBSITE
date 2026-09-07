-- AlterEnum: Menambahkan nilai status pesanan baru
-- IF NOT EXISTS digunakan agar aman jika nilai sudah pernah ditambahkan langsung ke DB
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'MENUNGGU_ONGKIR';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'MENUNGGU_BAYAR';

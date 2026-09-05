-- Placeholder: migration applied directly to DB. Actual changes already applied via 20260831065931_add_menunggu_ongkir_bayar_status.
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'MENUNGGU_ONGKIR';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'MENUNGGU_BAYAR';

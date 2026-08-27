-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "emoji" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discount" INTEGER,
ADD COLUMN     "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "originalPrice" DECIMAL(12,2),
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tags" TEXT[];

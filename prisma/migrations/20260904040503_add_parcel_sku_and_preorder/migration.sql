-- AlterTable
ALTER TABLE "Bundle" ADD COLUMN     "sku" TEXT,
ADD COLUMN     "isPreorder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preorderDays" INTEGER DEFAULT 14;

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "specification" TEXT;

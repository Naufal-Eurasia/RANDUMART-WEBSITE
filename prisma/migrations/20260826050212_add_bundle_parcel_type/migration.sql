/*
  Warnings:

  - Added the required column `price` to the `Bundle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Bundle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BundleType" AS ENUM ('BUNDLING', 'PARSEL');

-- AlterTable
ALTER TABLE "Bundle" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "details" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "price" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "type" "BundleType" NOT NULL DEFAULT 'BUNDLING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

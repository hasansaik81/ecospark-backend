/*
  Warnings:

  - You are about to drop the column `currency` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentIntentId` on the `payments` table. All the data in the column will be lost.
  - The `status` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[stripeEventId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'PENDING';
ALTER TYPE "PaymentStatus" ADD VALUE 'APPROVED';

-- DropIndex
DROP INDEX "payments_status_idx";

-- DropIndex
DROP INDEX "payments_stripePaymentIntentId_key";

-- DropIndex
DROP INDEX "payments_stripeSessionId_idx";

-- DropIndex
DROP INDEX "payments_stripeSessionId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "currency",
DROP COLUMN "paidAt",
DROP COLUMN "paymentMethod",
DROP COLUMN "stripePaymentIntentId",
ADD COLUMN     "paymentGatewayData" JSONB,
ADD COLUMN     "stripeEventId" TEXT,
ADD COLUMN     "stripePaymentId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeEventId_key" ON "payments"("stripeEventId");

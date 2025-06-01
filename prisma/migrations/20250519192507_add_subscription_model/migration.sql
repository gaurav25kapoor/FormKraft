-- DropIndex
DROP INDEX "Subscription_userId_key";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "plan" TEXT,
ALTER COLUMN "subscribed" DROP DEFAULT;

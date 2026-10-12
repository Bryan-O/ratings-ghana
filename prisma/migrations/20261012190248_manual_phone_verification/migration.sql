-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneRequest" TEXT,
ADD COLUMN     "phoneRequestedAt" TIMESTAMP(3),
ADD COLUMN     "phoneVerifiedById" TEXT;

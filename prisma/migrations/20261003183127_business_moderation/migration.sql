-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Business_submittedById_status_idx" ON "Business"("submittedById", "status");

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('BUG', 'CONFUSING', 'IDEA', 'OTHER');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('NEW', 'RESOLVED');

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "message" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "userAgent" TEXT,
    "viewport" TEXT,
    "email" TEXT,
    "userId" TEXT,
    "ipHash" TEXT,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'NEW',
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feedback_status_createdAt_idx" ON "Feedback"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Feedback_ipHash_createdAt_idx" ON "Feedback"("ipHash", "createdAt");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

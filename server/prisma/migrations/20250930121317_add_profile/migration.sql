-- AlterTable
ALTER TABLE "public"."RefreshTokens" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "name" TEXT;

/*
  Warnings:

  - You are about to drop the column `recipientId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `recipientEmail` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderEmail` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_senderId_fkey";

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "recipientId",
DROP COLUMN "senderId",
ADD COLUMN     "recipientEmail" TEXT NOT NULL,
ADD COLUMN     "senderEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderEmail_fkey" FOREIGN KEY ("senderEmail") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_recipientEmail_fkey" FOREIGN KEY ("recipientEmail") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

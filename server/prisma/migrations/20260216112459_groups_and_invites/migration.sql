/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,name]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- AlterEnum
ALTER TYPE "ConversationType" ADD VALUE 'GROUP';

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "name" TEXT,
ADD COLUMN     "ownerId" TEXT;

-- AlterTable
ALTER TABLE "ConversationParticipant" ADD COLUMN     "role" "ParticipantRole" NOT NULL DEFAULT 'MEMBER';

-- CreateTable
CREATE TABLE "GroupInviteLink" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "GroupInviteLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupInviteLink_code_key" ON "GroupInviteLink"("code");

-- CreateIndex
CREATE INDEX "GroupInviteLink_code_idx" ON "GroupInviteLink"("code");

-- CreateIndex
CREATE INDEX "GroupInviteLink_conversationId_idx" ON "GroupInviteLink"("conversationId");

-- CreateIndex
CREATE INDEX "GroupInviteLink_expiresAt_idx" ON "GroupInviteLink"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_ownerId_name_key" ON "Conversation"("ownerId", "name");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInviteLink" ADD CONSTRAINT "GroupInviteLink_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInviteLink" ADD CONSTRAINT "GroupInviteLink_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

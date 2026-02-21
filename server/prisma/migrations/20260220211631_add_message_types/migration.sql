-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'USER_JOINED', 'USER_LEFT');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'TEXT';

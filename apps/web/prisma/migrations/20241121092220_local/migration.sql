/*
  Warnings:

  - You are about to drop the column `teamId` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Document` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DocumentVisibility" AS ENUM ('private', 'public');

-- CreateEnum
CREATE TYPE "CollectionPrivacy" AS ENUM ('private', 'public');

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_teamId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_teamId_fkey";

-- DropIndex
DROP INDEX "Collection_name_teamId_key";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "teamId",
ADD COLUMN     "privacy" "CollectionPrivacy";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "teamId",
ADD COLUMN     "publishedContent" JSONB,
ADD COLUMN     "visibility" "DocumentVisibility";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "teamId" DROP NOT NULL,
ALTER COLUMN "notificationSettings" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" VARCHAR(255) NOT NULL,
    "hash" TEXT NOT NULL,
    "last4" CHAR(4) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "lastActiveAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_hash_key" ON "ApiKey"("hash");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

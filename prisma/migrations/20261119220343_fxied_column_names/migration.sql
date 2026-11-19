/*
  Warnings:

  - You are about to drop the column `created_at` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `display_name` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `steam_id` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[steamId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `displayName` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `steamId` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Users_steam_id_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "created_at",
DROP COLUMN "display_name",
DROP COLUMN "steam_id",
DROP COLUMN "update_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "steamId" TEXT NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Users_steamId_key" ON "Users"("steamId");

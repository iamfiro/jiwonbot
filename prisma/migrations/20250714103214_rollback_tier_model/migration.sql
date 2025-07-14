/*
  Warnings:

  - You are about to drop the `user_game_tiers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "user_game_tiers";

-- CreateTable
CREATE TABLE "Tier" (
    "userId" TEXT NOT NULL DEFAULT '',
    "valorantTier" TEXT NOT NULL DEFAULT '',
    "lolTier" TEXT NOT NULL DEFAULT ''
);

-- CreateIndex
CREATE UNIQUE INDEX "Tier_userId_key" ON "Tier"("userId");

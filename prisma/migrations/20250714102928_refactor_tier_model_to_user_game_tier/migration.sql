/*
  Warnings:

  - You are about to drop the `Tier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Tier";

-- CreateTable
CREATE TABLE "user_game_tiers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_game_tiers_userId_game_key" ON "user_game_tiers"("userId", "game");

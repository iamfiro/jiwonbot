/*
  Warnings:

  - You are about to drop the `ScoreBoard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ScoreBoard";

-- CreateTable
CREATE TABLE "scoreboards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "redName" TEXT NOT NULL,
    "blueName" TEXT NOT NULL,
    "redScore" INTEGER NOT NULL DEFAULT 0,
    "blueScore" INTEGER NOT NULL DEFAULT 0,
    "targetScore" INTEGER NOT NULL DEFAULT 10,
    "messageId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "winner" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scoreboards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scoreboards_messageId_key" ON "scoreboards"("messageId");

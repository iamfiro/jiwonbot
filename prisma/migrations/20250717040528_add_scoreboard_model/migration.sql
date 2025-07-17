-- CreateTable
CREATE TABLE "ScoreBoard" (
    "guildId" TEXT NOT NULL DEFAULT '',
    "messageId" TEXT NOT NULL DEFAULT '',
    "interactionId" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "redName" TEXT NOT NULL DEFAULT '',
    "blueName" TEXT NOT NULL DEFAULT '',
    "redScore" INTEGER NOT NULL DEFAULT 0,
    "blueScore" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "ScoreBoard_messageId_key" ON "ScoreBoard"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "ScoreBoard_interactionId_key" ON "ScoreBoard"("interactionId");

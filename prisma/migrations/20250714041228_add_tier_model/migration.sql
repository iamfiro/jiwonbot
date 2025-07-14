-- CreateTable
CREATE TABLE "Tier" (
    "userId" TEXT NOT NULL DEFAULT '',
    "valorantTier" TEXT NOT NULL DEFAULT '',
    "lolTier" TEXT NOT NULL DEFAULT ''
);

-- CreateIndex
CREATE UNIQUE INDEX "Tier_userId_key" ON "Tier"("userId");

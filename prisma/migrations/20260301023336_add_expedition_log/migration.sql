-- CreateTable
CREATE TABLE "ExpeditionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dungeon" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "gameDifficulty" INTEGER,
    "heroes" TEXT NOT NULL,
    "provisions" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "casualties" TEXT NOT NULL,
    "loot" TEXT NOT NULL,
    "stressNotes" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExpeditionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ExpeditionLog_userId_idx" ON "ExpeditionLog"("userId");

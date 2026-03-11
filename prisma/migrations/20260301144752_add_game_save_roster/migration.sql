/*
  Warnings:

  - You are about to drop the column `userId` on the `ExpeditionLog` table. All the data in the column will be lost.
  - Added the required column `gameSaveId` to the `ExpeditionLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "GameSave" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GameSave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RosterHero" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameSaveId" TEXT NOT NULL,
    "heroClass" INTEGER NOT NULL,
    "customName" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "positiveQuirks" TEXT NOT NULL,
    "negativeQuirks" TEXT NOT NULL,
    "diseases" TEXT NOT NULL,
    "trinket1" TEXT NOT NULL,
    "trinket2" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RosterHero_gameSaveId_fkey" FOREIGN KEY ("gameSaveId") REFERENCES "GameSave" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExpeditionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameSaveId" TEXT NOT NULL,
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
    CONSTRAINT "ExpeditionLog_gameSaveId_fkey" FOREIGN KEY ("gameSaveId") REFERENCES "GameSave" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExpeditionLog" ("casualties", "createdAt", "difficulty", "dungeon", "duration", "gameDifficulty", "heroes", "id", "loot", "notes", "outcome", "provisions", "rating", "stressNotes") SELECT "casualties", "createdAt", "difficulty", "dungeon", "duration", "gameDifficulty", "heroes", "id", "loot", "notes", "outcome", "provisions", "rating", "stressNotes" FROM "ExpeditionLog";
DROP TABLE "ExpeditionLog";
ALTER TABLE "new_ExpeditionLog" RENAME TO "ExpeditionLog";
CREATE INDEX "ExpeditionLog_gameSaveId_idx" ON "ExpeditionLog"("gameSaveId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "GameSave_userId_idx" ON "GameSave"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GameSave_userId_slot_key" ON "GameSave"("userId", "slot");

-- CreateIndex
CREATE INDEX "RosterHero_gameSaveId_idx" ON "RosterHero"("gameSaveId");

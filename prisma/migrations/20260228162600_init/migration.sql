-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "alias" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GameRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "s_15" INTEGER NOT NULL DEFAULT 0,
    "s_30" INTEGER NOT NULL DEFAULT 0,
    "s_45" INTEGER NOT NULL DEFAULT 0,
    "s_60" INTEGER NOT NULL DEFAULT 0,
    "m_15" INTEGER NOT NULL DEFAULT 0,
    "m_30" INTEGER NOT NULL DEFAULT 0,
    "m_45" INTEGER NOT NULL DEFAULT 0,
    "m_60" INTEGER NOT NULL DEFAULT 0,
    "l_15" INTEGER NOT NULL DEFAULT 0,
    "l_30" INTEGER NOT NULL DEFAULT 0,
    "l_45" INTEGER NOT NULL DEFAULT 0,
    "l_60" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "GameRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DungeonRecommendation" (
    "dungeonId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "GameRecord_userId_key" ON "GameRecord"("userId");

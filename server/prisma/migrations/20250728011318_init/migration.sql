-- CreateTable
CREATE TABLE "game_states" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "crystals" INTEGER NOT NULL DEFAULT 0,
    "energy" INTEGER NOT NULL DEFAULT 100,
    "research" INTEGER NOT NULL DEFAULT 0,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "gameStateId" TEXT NOT NULL,
    CONSTRAINT "resources_gameStateId_fkey" FOREIGN KEY ("gameStateId") REFERENCES "game_states" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ships" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "velocity" TEXT NOT NULL,
    "rotation" REAL NOT NULL,
    "efficiency" REAL NOT NULL DEFAULT 1.0,
    "capacity" INTEGER NOT NULL DEFAULT 100,
    "gameStateId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ships_gameStateId_fkey" FOREIGN KEY ("gameStateId") REFERENCES "game_states" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "upgrades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "cost" INTEGER NOT NULL,
    "effect" TEXT NOT NULL,
    "gameStateId" TEXT NOT NULL,
    CONSTRAINT "upgrades_gameStateId_fkey" FOREIGN KEY ("gameStateId") REFERENCES "game_states" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "statistics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalPlayTime" INTEGER NOT NULL DEFAULT 0,
    "totalCrystals" INTEGER NOT NULL DEFAULT 0,
    "shipsDeployed" INTEGER NOT NULL DEFAULT 0,
    "upgradesBought" INTEGER NOT NULL DEFAULT 0,
    "gameStateId" TEXT NOT NULL,
    CONSTRAINT "statistics_gameStateId_fkey" FOREIGN KEY ("gameStateId") REFERENCES "game_states" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "game_states_playerId_key" ON "game_states"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "resources_gameStateId_key" ON "resources"("gameStateId");

-- CreateIndex
CREATE UNIQUE INDEX "statistics_gameStateId_key" ON "statistics"("gameStateId");

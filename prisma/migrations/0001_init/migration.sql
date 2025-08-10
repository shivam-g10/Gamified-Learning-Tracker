-- CreateEnum
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE "QuestType" AS ENUM ('topic', 'project', 'bonus');

-- CreateTable
CREATE TABLE "Quest" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "xp" INTEGER NOT NULL CHECK ("xp" >= 0),
    "type" "QuestType" NOT NULL,
    "category" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CreateTable
CREATE TABLE "AppState" (
    "id" INTEGER PRIMARY KEY DEFAULT 1,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "last_check_in" DATE NULL,
    "focus" UUID[] NOT NULL DEFAULT '{}'
);

-- Ensure single row exists with id=1
INSERT INTO "AppState" (id) VALUES (1) ON CONFLICT (id) DO NOTHING;



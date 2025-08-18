/*
  Warnings:

  - You are about to drop the `AppState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookProgressEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseProgressEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FocusSlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."BookProgressEntry" DROP CONSTRAINT "BookProgressEntry_book_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."CourseProgressEntry" DROP CONSTRAINT "CourseProgressEntry_course_id_fkey";

-- DropTable
DROP TABLE "public"."AppState";

-- DropTable
DROP TABLE "public"."Book";

-- DropTable
DROP TABLE "public"."BookProgressEntry";

-- DropTable
DROP TABLE "public"."Course";

-- DropTable
DROP TABLE "public"."CourseProgressEntry";

-- DropTable
DROP TABLE "public"."FocusSlot";

-- DropTable
DROP TABLE "public"."Quest";

-- CreateTable
CREATE TABLE "public"."quests" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "xp" INTEGER NOT NULL,
    "type" "public"."QuestType" NOT NULL,
    "category" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."books" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "total_pages" INTEGER NOT NULL DEFAULT 0,
    "current_page" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."BookStatus" NOT NULL DEFAULT 'backlog',
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Uncategorized',
    "tags" TEXT[],
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."book_progress_entries" (
    "id" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "from_page" INTEGER NOT NULL,
    "to_page" INTEGER NOT NULL,
    "pages_read" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_progress_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."courses" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "platform" TEXT,
    "url" TEXT,
    "total_units" INTEGER NOT NULL DEFAULT 0,
    "completed_units" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."CourseStatus" NOT NULL DEFAULT 'backlog',
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Uncategorized',
    "tags" TEXT[],
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_progress_entries" (
    "id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "units_delta" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_progress_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."app_states" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "last_check_in" DATE,
    "focus" UUID[],

    CONSTRAINT "app_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."focus_slots" (
    "id" UUID NOT NULL,
    "quest_id" UUID,
    "book_id" UUID,
    "course_id" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "focus_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "focus_slots_quest_id_book_id_course_id_key" ON "public"."focus_slots"("quest_id", "book_id", "course_id");

-- AddForeignKey
ALTER TABLE "public"."book_progress_entries" ADD CONSTRAINT "book_progress_entries_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_progress_entries" ADD CONSTRAINT "course_progress_entries_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

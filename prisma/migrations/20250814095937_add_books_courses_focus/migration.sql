-- CreateEnum
CREATE TYPE "public"."BookStatus" AS ENUM ('backlog', 'reading', 'finished');

-- CreateEnum
CREATE TYPE "public"."CourseStatus" AS ENUM ('backlog', 'learning', 'finished');

-- AlterTable
ALTER TABLE "public"."AppState" ALTER COLUMN "focus" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Quest" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."Book" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "total_pages" INTEGER NOT NULL DEFAULT 0,
    "current_page" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."BookStatus" NOT NULL DEFAULT 'backlog',
    "cover_url" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookProgressEntry" (
    "id" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "from_page" INTEGER NOT NULL,
    "to_page" INTEGER NOT NULL,
    "pages_read" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookProgressEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Course" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "platform" TEXT,
    "url" TEXT,
    "total_units" INTEGER NOT NULL DEFAULT 0,
    "completed_units" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."CourseStatus" NOT NULL DEFAULT 'backlog',
    "description" TEXT,
    "tags" TEXT[],
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseProgressEntry" (
    "id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "units_delta" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseProgressEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FocusSlot" (
    "id" UUID NOT NULL,
    "quest_id" UUID,
    "book_id" UUID,
    "course_id" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FocusSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FocusSlot_quest_id_book_id_course_id_key" ON "public"."FocusSlot"("quest_id", "book_id", "course_id");

-- AddForeignKey
ALTER TABLE "public"."BookProgressEntry" ADD CONSTRAINT "BookProgressEntry_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseProgressEntry" ADD CONSTRAINT "CourseProgressEntry_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `app_states` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `focus_slots` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quest_id,book_id,course_id,user_id]` on the table `focus_slots` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `app_states` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `focus_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `quests` table without a default value. This is not possible if the table is not empty.

*/

-- Create a default user for existing data
INSERT INTO "public"."users" ("id", "name", "email", "emailVerified", "image") 
VALUES ('default-user-id', 'Default User', 'default@example.com', NULL, NULL);

-- DropIndex
DROP INDEX "public"."focus_slots_quest_id_book_id_course_id_key";

-- AlterTable
ALTER TABLE "public"."app_states" ADD COLUMN     "user_id" TEXT NOT NULL DEFAULT 'default-user-id';

-- AlterTable
ALTER TABLE "public"."books" ADD COLUMN     "user_id" TEXT NOT NULL DEFAULT 'default-user-id';

-- AlterTable
ALTER TABLE "public"."courses" ADD COLUMN     "user_id" TEXT NOT NULL DEFAULT 'default-user-id';

-- AlterTable
ALTER TABLE "public"."focus_slots" ADD COLUMN     "user_id" TEXT NOT NULL DEFAULT 'default-user-id';

-- AlterTable
ALTER TABLE "public"."quests" ADD COLUMN     "user_id" TEXT NOT NULL DEFAULT 'default-user-id';

-- Remove the default values after data is populated
ALTER TABLE "public"."app_states" ALTER COLUMN "user_id" DROP DEFAULT;
ALTER TABLE "public"."books" ALTER COLUMN "user_id" DROP DEFAULT;
ALTER TABLE "public"."courses" ALTER COLUMN "user_id" DROP DEFAULT;
ALTER TABLE "public"."focus_slots" ALTER COLUMN "user_id" DROP DEFAULT;
ALTER TABLE "public"."quests" ALTER COLUMN "user_id" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "app_states_user_id_key" ON "public"."app_states"("user_id");

-- CreateIndex
CREATE INDEX "app_states_user_id_idx" ON "public"."app_states"("user_id");

-- CreateIndex
CREATE INDEX "book_progress_entries_book_id_idx" ON "public"."book_progress_entries"("book_id");

-- CreateIndex
CREATE INDEX "books_user_id_idx" ON "public"."books"("user_id");

-- CreateIndex
CREATE INDEX "books_user_id_status_idx" ON "public"."books"("user_id", "status");

-- CreateIndex
CREATE INDEX "books_user_id_category_idx" ON "public"."books"("user_id", "category");

-- CreateIndex
CREATE INDEX "course_progress_entries_course_id_idx" ON "public"."course_progress_entries"("course_id");

-- CreateIndex
CREATE INDEX "courses_user_id_idx" ON "public"."courses"("user_id");

-- CreateIndex
CREATE INDEX "courses_user_id_status_idx" ON "public"."courses"("user_id", "status");

-- CreateIndex
CREATE INDEX "courses_user_id_category_idx" ON "public"."courses"("user_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "focus_slots_user_id_key" ON "public"."focus_slots"("user_id");

-- CreateIndex
CREATE INDEX "focus_slots_user_id_idx" ON "public"."focus_slots"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "focus_slots_quest_id_book_id_course_id_user_id_key" ON "public"."focus_slots"("quest_id", "book_id", "course_id", "user_id");

-- CreateIndex
CREATE INDEX "quests_user_id_idx" ON "public"."quests"("user_id");

-- CreateIndex
CREATE INDEX "quests_user_id_done_idx" ON "public"."quests"("user_id", "done");

-- CreateIndex
CREATE INDEX "quests_user_id_category_idx" ON "public"."quests"("user_id", "category");

-- CreateIndex
CREATE INDEX "quests_user_id_type_idx" ON "public"."quests"("user_id", "type");

-- AddForeignKey
ALTER TABLE "public"."quests" ADD CONSTRAINT "quests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."books" ADD CONSTRAINT "books_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."app_states" ADD CONSTRAINT "app_states_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."focus_slots" ADD CONSTRAINT "focus_slots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

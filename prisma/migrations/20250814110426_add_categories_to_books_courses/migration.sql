-- AlterTable
ALTER TABLE "public"."Book" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Uncategorized';

-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Uncategorized';

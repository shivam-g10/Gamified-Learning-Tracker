-- Fix AppState id field from Int to UUID
-- Step 1: Add a new UUID column
ALTER TABLE "app_states" ADD COLUMN "new_id" UUID;

-- Step 2: Generate UUIDs for existing records
UPDATE "app_states" SET "new_id" = gen_random_uuid();

-- Step 3: Drop the old id column and rename the new one
ALTER TABLE "app_states" DROP CONSTRAINT "app_states_pkey";
ALTER TABLE "app_states" DROP COLUMN "id";
ALTER TABLE "app_states" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "app_states" ADD PRIMARY KEY ("id");

-- Step 4: Update the sequence (if any) and set default
ALTER TABLE "app_states" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

#!/bin/sh

# Generate Prisma client first
echo "Generating Prisma client..."
pnpm prisma generate

# Wait for database to be ready
echo "Waiting for database..."
echo "Testing database connection..."

# Try to connect to database using a shell-compatible method
while ! echo "SELECT 1;" | pnpm prisma db execute --stdin > /dev/null 2>&1; do
  echo "Database connection failed, retrying in 1 second..."
  sleep 1
done

echo "Database is ready, running migrations..."
pnpm prisma migrate deploy

echo "Seeding database with initial data..."
pnpm run db:seed

echo "Starting Next.js app on port ${PORT:-3000}..."
exec node node_modules/next/dist/bin/next start -p ${PORT:-3000}

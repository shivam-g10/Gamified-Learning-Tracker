#!/bin/sh

echo "🚀 Starting development environment..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; do
  echo "Database not ready, waiting..."
  sleep 2
done

echo "✅ Database is ready!"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "📊 Pushing database schema..."
npx prisma db push --accept-data-loss

# Seed database if needed
echo "🌱 Seeding database..."
npx prisma db seed

echo "🎯 Starting Next.js development server..."
exec pnpm dev

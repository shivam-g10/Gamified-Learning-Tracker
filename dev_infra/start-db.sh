#!/bin/sh

echo "🚀 Starting development database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Start the database
echo "📊 Starting PostgreSQL database..."
docker compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until docker compose exec -T db pg_isready -U postgres > /dev/null 2>&1; do
    echo "Database not ready, waiting..."
    sleep 2
done

echo "✅ Database is ready!"
echo "📊 Database accessible at: localhost:5432"
echo "🔑 Credentials: postgres/postgres"
echo "🗄️  Database: tracker"
echo ""
echo "💡 Next steps:"
echo "   1. Run: pnpm prisma generate"
echo "   2. Run: pnpm prisma db push"
echo "   3. Database is ready to use"
echo "   4. Run: pnpm dev"

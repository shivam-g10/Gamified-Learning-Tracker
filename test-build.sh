#!/bin/bash

echo "🧪 Testing build process locally..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm is not installed. Please install pnpm first."
    exit 1
fi

echo "📦 Installing dependencies..."
pnpm install

echo "🔧 Setting up environment..."
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tracker"

echo "⚡ Generating Prisma client..."
pnpm prisma generate

echo "🏗️ Building Next.js application..."
pnpm build

echo "✅ Build completed successfully!"
echo "📁 Checking build artifacts..."

if [ -d ".next" ]; then
    echo "✅ .next directory exists"
    ls -la .next
else
    echo "❌ .next directory not found"
fi

if [ -d "public" ]; then
    echo "✅ public directory exists"
    ls -la public
else
    echo "❌ public directory not found"
fi

if [ -d "node_modules" ]; then
    echo "✅ node_modules directory exists"
    echo "📦 Node modules size: $(du -sh node_modules | cut -f1)"
else
    echo "❌ node_modules directory not found"
fi

echo "🎉 Build test completed!"

# Start development database for Windows
Write-Host "🚀 Starting development database..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Error: Docker is not running. Please start Docker first." -ForegroundColor Red
    exit 1
}

# Start the database
Write-Host "📊 Starting PostgreSQL database..." -ForegroundColor Yellow
docker compose up -d

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
do {
    Write-Host "Database not ready, waiting..." -ForegroundColor Cyan
    Start-Sleep -Seconds 2
} while (-not (docker compose exec -T db pg_isready -U postgres 2>$null))

Write-Host "✅ Database is ready!" -ForegroundColor Green
Write-Host "📊 Database accessible at: localhost:5432" -ForegroundColor Cyan
Write-Host "🔑 Credentials: postgres/postgres" -ForegroundColor Cyan
Write-Host "🗄️  Database: tracker" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Run: pnpm prisma generate" -ForegroundColor White
Write-Host "   2. Run: pnpm prisma db push" -ForegroundColor White
    Write-Host "   3. Database is ready to use" -ForegroundColor White
Write-Host "   4. Run: pnpm dev" -ForegroundColor White

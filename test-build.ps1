# Test build process locally for Windows
Write-Host "🧪 Testing build process locally..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Check if pnpm is installed
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm version: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: pnpm is not installed. Please install pnpm first." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
pnpm install

Write-Host "🔧 Setting up environment..." -ForegroundColor Yellow
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/tracker"

Write-Host "⚡ Generating Prisma client..." -ForegroundColor Yellow
pnpm prisma generate

Write-Host "🏗️ Building Next.js application..." -ForegroundColor Yellow
pnpm build

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host "📁 Checking build artifacts..." -ForegroundColor Yellow

if (Test-Path ".next") {
    Write-Host "✅ .next directory exists" -ForegroundColor Green
    Get-ChildItem ".next" | Select-Object Name, Length, LastWriteTime
} else {
    Write-Host "❌ .next directory not found" -ForegroundColor Red
}

if (Test-Path "public") {
    Write-Host "✅ public directory exists" -ForegroundColor Green
    Get-ChildItem "public" | Select-Object Name, Length, LastWriteTime
} else {
    Write-Host "❌ public directory not found" -ForegroundColor Red
}

if (Test-Path "node_modules") {
    Write-Host "✅ node_modules directory exists" -ForegroundColor Green
    $size = (Get-ChildItem "node_modules" -Recurse | Measure-Object -Property Length -Sum).Sum
    Write-Host "📦 Node modules size: $([math]::Round($size / 1MB, 2)) MB" -ForegroundColor Cyan
} else {
    Write-Host "❌ node_modules directory not found" -ForegroundColor Red
}

Write-Host "🎉 Build test completed!" -ForegroundColor Green

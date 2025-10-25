Write-Host "Starting RoomApp Development Server..." -ForegroundColor Green
Write-Host ""

# Set the current directory to the script location
Set-Location $PSScriptRoot

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

Write-Host "Installing dependencies if needed..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev

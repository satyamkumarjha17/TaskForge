$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host "TaskForge setup" -ForegroundColor Cyan

if (-not (Test-Path "server/.env")) {
    Copy-Item "server/.env.example" "server/.env"
    Write-Host "Created server/.env from the example."
}

if (-not (Test-Path "client/.env")) {
    Copy-Item "client/.env.example" "client/.env"
    Write-Host "Created client/.env from the example."
}

if (-not (Select-String -Path "server/.env" -Pattern '^SHADOW_DATABASE_URL=' -Quiet)) {
    Add-Content -Path "server/.env" -Value 'SHADOW_DATABASE_URL="mysql://taskforge_migrator:change_me@localhost:3306/taskforge_shadow"'
    Write-Host "Added SHADOW_DATABASE_URL placeholder to server/.env."
}

$serverEnv = (Resolve-Path "server/.env").Path
Write-Host ""
Write-Host "Configure DATABASE_URL, DIRECT_URL, SHADOW_DATABASE_URL, and a JWT_SECRET of at least 32 characters in server/.env."
Write-Host "The taskforge and taskforge_shadow databases and users must already exist. See README.md."
Start-Process -FilePath "notepad.exe" -ArgumentList "`"$serverEnv`"" -Wait

Write-Host ""
Write-Host "Installing exact dependencies from package-lock.json..."
npm ci
if ($LASTEXITCODE -ne 0) { throw "npm install failed." }

Write-Host "Validating Prisma schema..."
npm run db:validate
if ($LASTEXITCODE -ne 0) { throw "Prisma schema validation failed." }

Write-Host "Generating Prisma Client..."
npm run db:generate
if ($LASTEXITCODE -ne 0) { throw "Prisma Client generation failed." }

Write-Host "Applying the initial database migration..."
npm run db:migrate
if ($LASTEXITCODE -ne 0) { throw "Database migration failed. Check MySQL and server/.env." }

Write-Host ""
Write-Host "Starting TaskForge. Client: http://localhost:5173 | API: http://localhost:4000" -ForegroundColor Green
npm run dev

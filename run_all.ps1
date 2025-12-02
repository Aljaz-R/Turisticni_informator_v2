<<<<<<< Updated upstream
# run_all.ps1

$Root = "C:\Users\aljaz\Desktop\RIRS_turisti"
=======
# run_all.ps1 (macOS/Linux verzija)
# Unified script for Postgres, backend migrations/seed and backend+frontend dev servers.

$Root = "/Users/gjorcheska/Documents/GitHub/Turisticni_informator_v2"
>>>>>>> Stashed changes
$Infra = Join-Path $Root "infra"
$Backend = Join-Path $Root "backend"
$Frontend = Join-Path $Root "frontend"

function Assert-Dir([string]$p) {
  if (-not (Test-Path -Path $p -PathType Container)) {
    Write-Error "Mapa ne obstaja: $p"; exit 1
  }
}

function Ensure-Env-File() {
  $envPath = Join-Path $Backend ".env"
  if (-not (Test-Path $envPath)) {
@"
DATABASE_URL=postgres://app:app@localhost:5432/tourinfo
PORT=3000
ADMIN_USER=admin
ADMIN_PASS=admin123
"@ | Out-File -Encoding UTF8 $envPath
    Write-Host "Ustvarjen .env v $envPath"
  } else {
<<<<<<< Updated upstream
    Write-Host ".env že obstaja ($envPath) — preskakujem."
  }
}

function Start-NewWindow([string]$Title, [string]$WorkingDir, [string]$Command) {
  $psCmd = "Set-Location `"$WorkingDir`"; $Command"
  # odpri novo okno: cmd → start → powershell -NoExit -Command "<psCmd>"
  Start-Process -FilePath cmd.exe -ArgumentList @('/c','start',"`"$Title`"",'powershell','-NoExit','-Command', $psCmd) | Out-Null
  Write-Host "Zagnal: $Title @ $WorkingDir → $Command"
=======
    Write-Host ".env že obstaja ($envPath)"
  }
}

function Start-JobRunner([string]$Title, [string]$Dir, [string]$Command) {
  Write-Host "Zaganjam background job: $Title → $Command"
  Start-Job -ScriptBlock {
    Set-Location $using:Dir
    & npm run dev
  }
>>>>>>> Stashed changes
}

Assert-Dir $Root
Assert-Dir $Infra
Assert-Dir $Backend
Assert-Dir $Frontend

try { Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force | Out-Null } catch {}

<<<<<<< Updated upstream
$ComposeFile = Join-Path $Infra "docker-compose.yml"
if (-not (Test-Path $ComposeFile)) { Write-Error "Manjka $ComposeFile"; exit 1 }

Write-Host "Docker Compose…"
docker compose -f $ComposeFile up -d
if ($LASTEXITCODE -ne 0) { Write-Error "Docker Compose ni uspel."; exit 1 }

Ensure-Env-File

Write-Host "Backend npm i…"
Push-Location $Backend
npm.cmd i
if ($LASTEXITCODE -ne 0) { Write-Error "npm i (backend) failed."; Pop-Location; exit 1 }

Write-Host "Migracije…"
npm.cmd run db:migrate
if ($LASTEXITCODE -ne 0) { Write-Error "Migracije failed."; Pop-Location; exit 1 }

Write-Host "Seed…"
npm.cmd run db:seed
if ($LASTEXITCODE -ne 0) { Write-Error "Seed failed."; Pop-Location; exit 1 }
Pop-Location

Write-Host "Frontend npm i…"
Push-Location $Frontend
npm.cmd i
if ($LASTEXITCODE -ne 0) { Write-Error "npm i (frontend) failed."; Pop-Location; exit 1 }
Pop-Location

Start-NewWindow -Title "Backend" -WorkingDir $Backend -Command "npm.cmd run dev"
Start-NewWindow -Title "Frontend" -WorkingDir $Frontend -Command "npm.cmd run dev"
=======
# Docker Postgres
$ComposeFile = Join-Path $Infra "docker-compose.yml"
if (-not (Test-Path $ComposeFile)) { Write-Error "Manjka $ComposeFile"; exit 1 }

Write-Host "Zaganjam Docker Compose…"
docker compose -f $ComposeFile up -d
if ($LASTEXITCODE -ne 0) { Write-Error "Docker Compose ni uspel."; exit 1 }

# Backend steps
Ensure-Env-File

Write-Host "Namestitev backend odvisnosti…"
Push-Location $Backend
npm install
if ($LASTEXITCODE -ne 0) { Write-Error "npm install (backend) ni uspel."; Pop-Location; exit 1 }

Write-Host "Migracije…"
npm run db:migrate
if ($LASTEXITCODE -ne 0) { Write-Error "Migracije niso uspele."; Pop-Location; exit 1 }

Write-Host "Seed…"
npm run db:seed
if ($LASTEXITCODE -ne 0) { Write-Error "Seed ni uspel."; Pop-Location; exit 1 }
Pop-Location

# Frontend
Write-Host "Namestitev frontend odvisnosti…"
Push-Location $Frontend
npm install
if ($LASTEXITCODE -ne 0) { Write-Error "npm install (frontend) ni uspel."; Pop-Location; exit 1 }
Pop-Location

# Start backend + frontend in background jobs
Start-JobRunner -Title "Backend" -Dir $Backend -Command "npm run dev"
Start-JobRunner -Title "Frontend" -Dir $Frontend -Command "npm run dev"
>>>>>>> Stashed changes

Write-Host ""
Write-Host "-------------------------------------------------------"
Write-Host "Backend: http://localhost:3000"
<<<<<<< Updated upstream
Write-Host "Frontend: preveri URL v oknu (npr. http://localhost:5173)"
Write-Host "Admin Basic Auth: admin / admin123"
=======
Write-Host "Frontend URL bo izpisan v job outputu (tipično http://localhost:5173)"
Write-Host "Admin API Basic Auth: admin / admin123"
Write-Host "-------------------------------------------------------"
Write-Host "Za pregled jobov: Get-Job"
Write-Host "Za log enega: Receive-Job -Id <id>"
Write-Host "Za ustavitev: Stop-Job *; Remove-Job *"
>>>>>>> Stashed changes
Write-Host "-------------------------------------------------------"

# run_all.ps1

$Root = "C:\Users\aljaz\Desktop\RIRS_turisti"
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
    Write-Host ".env že obstaja ($envPath) — preskakujem."
  }
}

function Start-NewWindow([string]$Title, [string]$WorkingDir, [string]$Command) {
  $psCmd = "Set-Location `"$WorkingDir`"; $Command"
  # odpri novo okno: cmd → start → powershell -NoExit -Command "<psCmd>"
  Start-Process -FilePath cmd.exe -ArgumentList @('/c','start',"`"$Title`"",'powershell','-NoExit','-Command', $psCmd) | Out-Null
  Write-Host "Zagnal: $Title @ $WorkingDir → $Command"
}

Assert-Dir $Root
Assert-Dir $Infra
Assert-Dir $Backend
Assert-Dir $Frontend

try { Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force | Out-Null } catch {}

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

Write-Host ""
Write-Host "-------------------------------------------------------"
Write-Host "Backend: http://localhost:3000"
Write-Host "Frontend: preveri URL v oknu (npr. http://localhost:5173)"
Write-Host "Admin Basic Auth: admin / admin123"
Write-Host "-------------------------------------------------------"

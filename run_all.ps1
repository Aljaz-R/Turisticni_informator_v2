# run_all.ps1
# Enotna skripta za zagon Docker Postgresa, backend migracije/seed in zagon backend + frontend dev strežnikov.

# === Nastavitve poti (po potrebi prilagodi) ===
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
    Write-Host ".env že obstaja ($envPath) — preskakujem ustvarjanje."
  }
}
function Start-NewWindow([string]$Title, [string]$WorkingDir, [string]$Command) {
  $args = "-NoExit", "-Command", "Set-Location `"$WorkingDir`"; $Command"
  Start-Process -FilePath "powershell.exe" -ArgumentList $args -WorkingDirectory $WorkingDir -WindowStyle Normal
  Write-Host "Zagnal novo okno: $Title ($WorkingDir): $Command"
}

# === Preveri mape ===
Assert-Dir $Root
Assert-Dir $Infra
Assert-Dir $Backend
Assert-Dir $Frontend

try { Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force | Out-Null } catch {}

# === 1) Docker Postgres (compose up) ===
$ComposeFile = Join-Path $Infra "docker-compose.yml"
if (-not (Test-Path $ComposeFile)) { Write-Error "Manjka $ComposeFile"; exit 1 }
Write-Host "Zaganjam Docker Compose…"
docker compose -f $ComposeFile up -d
if ($LASTEXITCODE -ne 0) { Write-Error "Docker Compose ni uspel."; exit 1 }

# === 2) Backend: .env, namestitev paketov, migracije, seed ===
Ensure-Env-File
Write-Host "Namestitev backend odvisnosti (npm i)…"
Push-Location $Backend
npm.cmd i
if ($LASTEXITCODE -ne 0) { Write-Error "npm i (backend) ni uspel."; Pop-Location; exit 1 }

Write-Host "Migracije (knex migrate:latest)…"
npm.cmd run db:migrate
if ($LASTEXITCODE -ne 0) { Write-Error "Migracije niso uspele."; Pop-Location; exit 1 }

Write-Host "Seed (knex seed:run)…"
npm.cmd run db:seed
if ($LASTEXITCODE -ne 0) { Write-Error "Seed ni uspel."; Pop-Location; exit 1 }
Pop-Location

# === 3) Frontend: namestitev paketov ===
Write-Host "Namestitev frontend odvisnosti (npm i)…"
Push-Location $Frontend
npm.cmd i
if ($LASTEXITCODE -ne 0) { Write-Error "npm i (frontend) ni uspel."; Pop-Location; exit 1 }
Pop-Location

# === 4) Zagon dev strežnikov v ločenih oknih ===
Start-NewWindow -Title "Backend" -WorkingDir $Backend -Command "npm.cmd run dev"
Start-NewWindow -Title "Frontend" -WorkingDir $Frontend -Command "npm.cmd run dev"

Write-Host ""
Write-Host "-------------------------------------------------------"
Write-Host "Backend: http://localhost:3000"
Write-Host "Frontend (Vite): glej URL v oknu Frontend (npr. http://localhost:5173)"
Write-Host "Admin API Basic Auth: ADMIN_USER=admin, ADMIN_PASS=admin123 (iz .env)"
Write-Host "Primer admin klica (PowerShell):"
Write-Host '$hdr=@{"Authorization"="Basic "+[Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("admin:admin123")); "Content-Type"="application/json"}'
Write-Host 'Invoke-WebRequest http://localhost:3000/admin/countries -Headers $hdr | Select-Object -Expand Content'
Write-Host "-------------------------------------------------------"

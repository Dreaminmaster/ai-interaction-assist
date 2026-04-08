@echo off
cd /d %~dp0
if not exist .env copy .env.example .env >nul
where npm >nul 2>nul
if errorlevel 1 (
  echo npm not found. Please install Node.js first.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo Failed to install dependencies.
    pause
    exit /b 1
  )
)
echo Starting one-click local AI learning app...
call npx tsx watch src/server.one-click.ts

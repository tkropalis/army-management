@echo off
setlocal

REM Resolve base dir (this script in runtime\run)
set SCRIPT_DIR=%~dp0
for %%I in ("%SCRIPT_DIR%\..") do set BASE=%%~fI
set FRONTEND=%BASE%\frontend\dist
set PHP_DIR=%BASE%\windows\php
set CADDY_EXE=%BASE%\windows\caddy.exe
set PHP_INI=%PHP_DIR%\php.ini
set FCGI_PORT=9000

REM Ensure required files exist
if not exist "%CADDY_EXE%" (
  echo Missing caddy.exe in runtime\windows\
  pause
  exit /b 1
)
if not exist "%PHP_DIR%\php-cgi.exe" (
  echo Missing php-cgi.exe in runtime\windows\php\
  pause
  exit /b 1
)

REM Kill any previous php-cgi on port
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :%FCGI_PORT%') do taskkill /PID %%p /F >nul 2>&1

REM Start PHP FastCGI
start "php-cgi" /min "%PHP_DIR%\php-cgi.exe" -b 127.0.0.1:%FCGI_PORT% -c "%PHP_INI%"

REM Start Caddy (serves SPA and proxies /api)
pushd "%BASE%\caddy"
start "caddy" "%CADDY_EXE%" run --config "%BASE%\caddy\Caddyfile"
popd

REM Open browser
start "" http://localhost:8080
echo App started. Close windows to stop.

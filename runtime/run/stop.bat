@echo off
taskkill /IM php-cgi.exe /F >nul 2>&1
taskkill /IM caddy.exe /F >nul 2>&1
echo Stopped.

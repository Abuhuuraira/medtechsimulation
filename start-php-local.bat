@echo off
setlocal

cd /d "%~dp0"

where php >nul 2>&1
if errorlevel 1 (
  echo [ERROR] PHP was not found in PATH.
  echo Install PHP and add it to PATH, then run this file again.
  echo Example check command: php -v
  pause
  exit /b 1
)

set "HOST=127.0.0.1"
set "PORT=8000"
set "URL=http://%HOST%:%PORT%/contact-us"

echo Starting PHP local server at http://%HOST%:%PORT%/
echo Contact page: %URL%
echo.
echo Press Ctrl+C in this window to stop the server.
echo.

start "" "%URL%"
php -S %HOST%:%PORT% -t "%~dp0"

endlocal

@echo off
REM Constituency Management System - Windows Startup Script

echo.
echo ========================================
echo Constituency Management System
echo ========================================
echo.

REM Kill any existing node processes
echo Cleaning up existing processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Check if node_modules exists
if not exist "node_modules" (
    echo.
    echo Installing dependencies...
    call npm install
)

REM Start the backend server in a new window
echo.
echo Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k npm run dev:server

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start the frontend server with workaround for Windows ESM issue
echo.
echo Starting Frontend Server (Port 3000)...
start "Frontend Server" cmd /k "set NODE_OPTIONS=--experimental-vm-modules && npm run dev:client"

echo.
echo ========================================
echo System Starting...
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Demo Credentials:
echo   Admin: admin@constituency.gov / admin123
echo   Staff: staff@constituency.gov / admin123
echo   Constituent: constituent1@example.com / admin123
echo.
echo ========================================
echo.

REM Keep this window open
pause

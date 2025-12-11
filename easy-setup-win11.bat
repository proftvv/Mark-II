@echo off
setlocal
title Report Mark II - Easy Setup (Windows 11)
color 0b

echo ===================================================
echo   Report Mark II - Easy Setup & Run Script
echo   Developed by Proftvv
echo ===================================================
echo.

:: 1. Check Node.js
echo [1/5] Checking Node.js installation...
node -v >nul 2>&1
if int errorlevel 1 (
    color 0c
    echo [ERROR] Node.js is NOT installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo Script cannot continue.
    pause
    exit /b
)
echo Node.js is installed.

:: 2. Check Database Connection (Env user config)
echo.
echo [2/5] Setting up environment configuration...
if not exist .env (
    echo .env file not found. Copying from .env.example...
    copy env.example .env >nul
    echo.
    echo [IMPORTANT] A new .env file has been created.
    echo Please ensure your MySQL database is running.
    echo Default DB Config: User=root, Pass=root, DB=report_mark2
    echo.
    set /p EDIT_ENV="Do you want to edit .env now? (Y/N): "
    if /i "%EDIT_ENV%"=="Y" notepad .env
)

:: 3. Install Dependencies
echo.
echo [3/5] Installing Project Dependencies...
cal npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies.
    pause
    exit /b
)

echo Installing Frontend Dependencies...
cd frontend
call npm install
cd ..
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies.
    pause
    exit /b
)

:: 4. Initialize Database
echo.
echo [4/5] Initializing Database Schema...
echo (Ensure MySQL service is running!)
node scripts/migrate-data.js
if %errorlevel% neq 0 (
    echo [WARNING] Database migration might have failed.
    echo Check if database 'report_mark2' exists and credentials are correct in .env
    echo You can try running 'node scripts/init-db.js' manually if this is a first run.
)

:: 5. Create Directories
if not exist "logs" mkdir logs
if not exist "temp_uploads" mkdir temp_uploads
if not exist "raporlar" mkdir raporlar
if not exist "raporlar\templates" mkdir raporlar\templates
if not exist "raporlar\generated" mkdir raporlar\generated

echo.
echo ===================================================
echo   SETUP COMPLETE!
echo   Starting Application...
echo ===================================================
echo.

npm run start:all

pause

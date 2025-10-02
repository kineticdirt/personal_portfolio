@echo off
REM Portfolio Transfer Script for Windows to Linux Server
REM This script helps transfer the portfolio to a remote Linux server

setlocal enabledelayedexpansion

echo 🚀 Portfolio Transfer Script for Linux Server
echo.

REM Check if required tools are available
where scp >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] SCP not found. Please install Git Bash or OpenSSH.
    pause
    exit /b 1
)

where ssh >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] SSH not found. Please install Git Bash or OpenSSH.
    pause
    exit /b 1
)

REM Get server details from user
set /p SSH_HOST="Enter SSH host (IP or domain): "
if "%SSH_HOST%"=="" (
    echo [ERROR] SSH host is required!
    pause
    exit /b 1
)

set /p SSH_USER="Enter SSH username (default: ubuntu): "
if "%SSH_USER%"=="" set SSH_USER=ubuntu

set /p SSH_PORT="Enter SSH port (default: 22): "
if "%SSH_PORT%"=="" set SSH_PORT=22

set /p SSH_KEY="Enter SSH key file path (optional, press Enter to skip): "

set /p DEST_DIR="Enter destination directory (default: ~/personal_portfolio): "
if "%DEST_DIR%"=="" set DEST_DIR=~/personal_portfolio

echo.
echo [INFO] Transferring to %SSH_USER%@%SSH_HOST%:%DEST_DIR%
echo.

REM Test SSH connection
echo [INFO] Testing SSH connection...
ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "echo 'SSH connection successful'"
if %errorlevel% neq 0 (
    echo [ERROR] SSH connection failed! Please check your credentials.
    pause
    exit /b 1
)

REM Create destination directory
echo [INFO] Creating destination directory...
ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "mkdir -p %DEST_DIR%"

REM Create archive
echo [INFO] Creating archive...
tar -czf portfolio.tar.gz --exclude=node_modules --exclude=.git --exclude=coverage .

REM Transfer archive
echo [INFO] Transferring files...
if "%SSH_KEY%"=="" (
    scp -P %SSH_PORT% portfolio.tar.gz %SSH_USER%@%SSH_HOST%:%DEST_DIR%/
) else (
    scp -P %SSH_PORT% -i "%SSH_KEY%" portfolio.tar.gz %SSH_USER%@%SSH_HOST%:%DEST_DIR%/
)

REM Extract on remote server
echo [INFO] Extracting files on remote server...
if "%SSH_KEY%"=="" (
    ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "cd %DEST_DIR% && tar -xzf portfolio.tar.gz && rm portfolio.tar.gz"
) else (
    ssh -p %SSH_PORT% -i "%SSH_KEY%" %SSH_USER%@%SSH_HOST% "cd %DEST_DIR% && tar -xzf portfolio.tar.gz && rm portfolio.tar.gz"
)

REM Clean up local archive
del portfolio.tar.gz

REM Set permissions
echo [INFO] Setting up permissions...
if "%SSH_KEY%"=="" (
    ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "cd %DEST_DIR% && chmod +x *.sh"
) else (
    ssh -p %SSH_PORT% -i "%SSH_KEY%" %SSH_USER%@%SSH_HOST% "cd %DEST_DIR% && chmod +x *.sh"
)

echo.
echo [SUCCESS] 🎉 Portfolio transfer completed successfully!
echo.
echo [INFO] Next steps on your Linux server:
echo 1. SSH into your server:
echo    ssh %SSH_USER%@%SSH_HOST%
echo.
echo 2. Navigate to the portfolio directory:
echo    cd %DEST_DIR%
echo.
echo 3. Install dependencies:
echo    ./install-dependencies.sh
echo.
echo 4. Set up Cloudflare tunnel:
echo    - Go to Cloudflare Dashboard ^> Zero Trust ^> Access ^> Tunnels
echo    - Create tunnel 'abhinav-portfolio-tunnel'
echo    - Download credentials to ~/.cloudflared/abhinav-portfolio-tunnel.json
echo    - Run: ./setup-cloudflare-tunnel.sh
echo.
echo [INFO] Your portfolio will be accessible at: https://portfolio.abhinavallam.com
echo.
pause


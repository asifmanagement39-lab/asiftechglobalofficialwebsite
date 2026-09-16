@echo off
chcp 65001 >nul
title Asif Tech Global — YouTube Live Bot Server
color 0A

echo =================================================================
echo   ASIF TECH GLOBAL -- YOUTUBE LIVE BOT & AUTOMATION SYSTEM
echo =================================================================
echo.
echo [1/2] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python was not found in PATH!
    echo Please install Python 3.10+ from python.org and add it to PATH.
    pause
    exit /b 1
)

echo [2/2] Launching Asif Tech Global Live Automation Server (Port 5000)...
echo.
echo Server is running at: http://localhost:5000
echo Open youtube.html in your browser to control the bot console.
echo Keep this window open while using the YouTube Bot.
echo.

start "" "http://localhost:5000/youtube.html"

cd /d "%~dp0yt_bot"
python bot_server.py

pause

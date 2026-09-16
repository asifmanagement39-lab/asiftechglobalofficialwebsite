@echo off
chcp 65001 >nul
title Asif Tech Global — YouTube Live Bot
color 0B

echo =================================================================
echo   ASIF TECH GLOBAL -- YOUTUBE LIVE BOT DIRECT LAUNCHER
echo =================================================================
echo.
cd /d "%~dp0"

:loop
python bot.py
echo.
echo [WARNING] Bot process finished or stopped. Restarting in 5 seconds...
timeout /t 5 >nul
goto loop

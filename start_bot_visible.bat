@echo off
chcp 65001 >nul
title Asif Tech Global — YouTube Live Bot (Visible Foreground Mode)
color 0B

echo =================================================================
echo   ASIF TECH GLOBAL -- YOUTUBE LIVE BOT (VISIBLE FRONT MODE)
echo =================================================================
echo.
echo Launching YouTube Live Bot with visible Chrome window in foreground...
echo.

cd /d "%~dp0yt_bot"
python bot.py

echo.
pause

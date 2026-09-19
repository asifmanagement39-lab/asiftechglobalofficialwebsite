@echo off
chcp 65001 >nul
title Asif Tech Global — YouTube Live Bot (Visible Foreground Mode)
color 0A

echo =================================================================
echo   ASIF TECH GLOBAL -- YOUTUBE LIVE BOT (VISIBLE FRONT MODE)
echo =================================================================
echo.
echo Launching YouTube Live Bot directly in foreground...
echo.

cd /d "%~dp0yt_bot"
python -u bot.py

echo.
pause

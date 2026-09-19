@echo off
chcp 65001 >nul
title Asif Tech Global — Import Existing Chrome Login
color 0A

echo =================================================================
echo   ASIF TECH GLOBAL -- IMPORT EXISTING CHROME SESSION HELPER
echo =================================================================
echo.
echo Agar aap apne computer ke normal Chrome me pehle se YouTube
echo par login hain, to ye tool aapka session automatically bot me
echo import kar dega taaki aapko dobara login na karna pade.
echo.
echo Press any key to copy your existing Chrome session to Bot...
pause >nul

cd /d "%~dp0yt_bot"
python import_chrome_session.py

echo.
echo =================================================================
echo Ab aap direct start_bot_visible.bat chala sakte hain!
echo =================================================================
echo.
pause

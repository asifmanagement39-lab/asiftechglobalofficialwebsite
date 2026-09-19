@echo off
chcp 65001 >nul
title Asif Tech Global — YouTube Account Sign-In
color 0E

echo =================================================================
echo   ASIF TECH GLOBAL -- YOUTUBE ONE-TIME LOGIN HELPER
echo =================================================================
echo.
echo Closing any running Chrome sessions...
taskkill /F /IM chrome.exe >nul 2>&1
timeout /t 2 >nul

set "PROFILE_DIR=%~dp0Saved_YT_Session"
if not exist "%PROFILE_DIR%" mkdir "%PROFILE_DIR%"

echo Opening Chrome to log in to your YouTube / Google account...
echo.

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="%PROFILE_DIR%" --profile-directory=Default "https://accounts.google.com/ServiceLogin?service=youtube&continue=https://www.youtube.com"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --user-data-dir="%PROFILE_DIR%" --profile-directory=Default "https://accounts.google.com/ServiceLogin?service=youtube&continue=https://www.youtube.com"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    start "" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" --user-data-dir="%PROFILE_DIR%" --profile-directory=Default "https://accounts.google.com/ServiceLogin?service=youtube&continue=https://www.youtube.com"
)

echo Chrome khul chuka hai! Login complete karke Chrome ko band kar dein.
pause

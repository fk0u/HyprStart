@echo off
setlocal enabledelayedexpansion

:: Define target paths
set "WORK_DIR=%~dp0"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS_FILE=%STARTUP_DIR%\hyprstart.vbs"
set "BAT_FILE=%WORK_DIR%start_hyprstart.bat"

echo 🌀 Installing HyprStart Background Service...
echo 📂 Project Directory: %WORK_DIR%

:: Create the silent VBS launcher directly in the Windows Startup folder
(
echo Set WshShell = CreateObject^("WScript.Shell"^)
echo WshShell.Run chr^(34^) ^& "%BAT_FILE%" ^& chr^(34^), 0
echo Set WshShell = Nothing
) > "%VBS_FILE%"

if exist "%VBS_FILE%" (
    echo.
    echo ✅ SUCCESS: HyprStart Startup service installed successfully!
    echo 📌 Location: %VBS_FILE%
    echo 🚀 HyprStart will now launch silently on port 8174 every time Windows boots.
    echo.
    
    :: Ask if user wants to start it right now
    echo Starting the background service now...
    wscript.exe "%VBS_FILE%"
    echo ✅ Background service is now running on http://localhost:8174
) else (
    echo ❌ ERROR: Failed to install startup script. Please run this script as Administrator.
)

pause

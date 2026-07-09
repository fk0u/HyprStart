@echo off
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS_FILE=%STARTUP_DIR%\hyprstart.vbs"

echo 🌀 Uninstalling HyprStart Background Service...

if exist "%VBS_FILE%" (
    del "%VBS_FILE%"
    echo ✅ SUCCESS: HyprStart Startup service removed from Startup folder.
    
    :: Attempt to terminate any active node/next processes running on port 8174
    echo.
    echo Terminating running HyprStart processes...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr 8174') do (
        taskkill /f /pid %%a >nul 2>&1
    )
    echo ✅ Terminated successfully.
) else (
    echo ℹ️ INFO: No startup service found in Startup folder.
)

pause

@echo off
title Divine Birthday Experience - Project Setup
color 0B

echo.
echo ============================================
echo     DIVINE BIRTHDAY EXPERIENCE
echo     Project Folder Setup
echo ============================================
echo.

set "PROJECT=Divine-Birthday"

if exist "%PROJECT%" (
    echo The "%PROJECT%" folder already exists.
    echo.
    choice /C YN /M "Do you want to continue and create missing folders/files"
    if errorlevel 2 goto :cancel
)

echo Creating project structure...
mkdir "%PROJECT%" 2>nul
mkdir "%PROJECT%\css" 2>nul
mkdir "%PROJECT%\js" 2>nul
mkdir "%PROJECT%\images" 2>nul
mkdir "%PROJECT%\images\memories" 2>nul
mkdir "%PROJECT%\images\gallery" 2>nul
mkdir "%PROJECT%\images\flowers" 2>nul
mkdir "%PROJECT%\images\music-art" 2>nul
mkdir "%PROJECT%\music" 2>nul
mkdir "%PROJECT%\fonts" 2>nul
mkdir "%PROJECT%\assets" 2>nul
mkdir "%PROJECT%\assets\icons" 2>nul
mkdir "%PROJECT%\assets\video" 2>nul

if not exist "%PROJECT%\index.html" (
    >"%PROJECT%\index.html" echo ^<!DOCTYPE html^>
    >>"%PROJECT%\index.html" echo ^<html lang="en"^>
    >>"%PROJECT%\index.html" echo ^<head^>
    >>"%PROJECT%\index.html" echo     ^<meta charset="UTF-8"^>
    >>"%PROJECT%\index.html" echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
    >>"%PROJECT%\index.html" echo     ^<title^>For Divine ^•^ Birthday Experience^</title^>
    >>"%PROJECT%\index.html" echo ^</head^>
    >>"%PROJECT%\index.html" echo ^<body^>
    >>"%PROJECT%\index.html" echo ^</body^>
    >>"%PROJECT%\index.html" echo ^</html^>
)

if not exist "%PROJECT%\css\style.css" (
    >"%PROJECT%\css\style.css" echo /* Divine Birthday Experience - Main Styles */
)

if not exist "%PROJECT%\js\app.js" (
    >"%PROJECT%\js\app.js" echo // Divine Birthday Experience - Main JavaScript
)

if not exist "%PROJECT%\README.txt" (
    >"%PROJECT%\README.txt" echo DIVINE BIRTHDAY EXPERIENCE
    >>"%PROJECT%\README.txt" echo.
    >>"%PROJECT%\README.txt" echo Main entry point: index.html
    >>"%PROJECT%\README.txt" echo.
    >>"%PROJECT%\README.txt" echo Folders:
    >>"%PROJECT%\README.txt" echo css       - Stylesheets
    >>"%PROJECT%\README.txt" echo js        - JavaScript
    >>"%PROJECT%\README.txt" echo images    - Photos and visual assets
    >>"%PROJECT%\README.txt" echo music     - Birthday songs and audio
    >>"%PROJECT%\README.txt" echo fonts     - Optional local fonts
    >>"%PROJECT%\README.txt" echo assets    - Icons and optional video assets
)

echo.
echo ============================================
echo Project created successfully!
echo ============================================
echo.
echo Location:
echo %CD%\%PROJECT%
echo.
echo Opening the project folder...
start "" "%PROJECT%"
echo.
echo Done.
pause
exit /b

:cancel
echo.
echo Setup cancelled.
pause
exit /b

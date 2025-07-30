@echo off
echo Nettoyage des caches Electron...

REM Supprimer les caches Electron
if exist "%APPDATA%\VestyWinBox" (
    rmdir /s /q "%APPDATA%\VestyWinBox"
    echo Cache VestyWinBox supprimé
)

if exist "%LOCALAPPDATA%\VestyWinBox" (
    rmdir /s /q "%LOCALAPPDATA%\VestyWinBox"
    echo Cache local VestyWinBox supprimé
)

REM Supprimer les caches temporaires
if exist "%TEMP%\VestyWinBox" (
    rmdir /s /q "%TEMP%\VestyWinBox"
    echo Cache temporaire supprimé
)

echo Nettoyage terminé !
pause 
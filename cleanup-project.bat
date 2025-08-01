@echo off
echo ========================================
echo    NETTOYAGE DU PROJET VESTYWINBOX
echo ========================================
echo.

echo [1/5] Suppression des fichiers de cache...
if exist "dist\assets\mon logo.png" del /f "dist\assets\mon logo.png"
if exist "dist\assets\logo-page-1.png" del /f "dist\assets\logo-page-1.png"
if exist "dist\assets\logo-barre-laterale.png" del /f "dist\assets\logo-barre-laterale.png"

echo [2/5] Suppression des logs CCleaner...
if exist "assets\tools\Apps portable\Maintenance système\ccsetup\LOG\*.log" del /f "assets\tools\Apps portable\Maintenance système\ccsetup\LOG\*.log"
if exist "dist\assets\tools\Apps portable\Maintenance système\ccsetup\LOG\*.log" del /f "dist\assets\tools\Apps portable\Maintenance système\ccsetup\LOG\*.log"

echo [3/5] Suppression des fichiers de sauvegarde...
if exist "assets\tools\Apps portable\Utilitaires & divers\Notepad++Portable\Data\Config\session.xml.inCaseOfCorruption.bak" del /f "assets\tools\Apps portable\Utilitaires & divers\Notepad++Portable\Data\Config\session.xml.inCaseOfCorruption.bak"
if exist "dist\assets\tools\Apps portable\Utilitaires & divers\Notepad++Portable\Data\Config\session.xml.inCaseOfCorruption.bak" del /f "dist\assets\tools\Apps portable\Utilitaires & divers\Notepad++Portable\Data\Config\session.xml.inCaseOfCorruption.bak"

echo [4/5] Nettoyage des modules Node.js...
if exist "node_modules" (
    echo Suppression du dossier node_modules...
    rmdir /s /q "node_modules"
)

echo [5/5] Nettoyage terminé !
echo.
echo ========================================
echo    NETTOYAGE TERMINÉ AVEC SUCCÈS
echo ========================================
pause 
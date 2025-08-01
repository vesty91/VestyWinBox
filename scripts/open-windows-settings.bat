@echo off
REM Script Batch pour ouvrir les paramètres Windows
REM Compatible Windows 10 et Windows 11

setlocal enabledelayedexpansion

echo 🔧 Ouverture des paramètres Windows...

REM Méthode 1: Utiliser start avec le protocole ms-settings
start ms-settings: 2>nul
if %errorlevel% equ 0 (
    echo ✅ Paramètres Windows ouverts avec succès!
    exit /b 0
)

REM Méthode 2: Utiliser PowerShell si disponible
echo 🔄 Tentative avec PowerShell...
powershell.exe -Command "Start-Process 'ms-settings:'" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Paramètres Windows ouverts via PowerShell!
    exit /b 0
)

REM Méthode 3: Utiliser explorer.exe
echo 🔄 Tentative avec explorer.exe...
explorer.exe ms-settings: 2>nul
if %errorlevel% equ 0 (
    echo ✅ Paramètres Windows ouverts via explorer.exe!
    exit /b 0
)

REM Méthode 4: Essayer de lancer l'application Paramètres directement
echo 🔄 Tentative avec l'application Paramètres...
start shell:AppsFolder\windows.immersivecontrolpanel_cw5n1h2txyewy!microsoft.windows.immersivecontrolpanel 2>nul
if %errorlevel% equ 0 (
    echo ✅ Application Paramètres ouverte!
    exit /b 0
)

echo ❌ Impossible d'ouvrir les paramètres Windows automatiquement.
echo 💡 Veuillez ouvrir manuellement les paramètres Windows.
pause
exit /b 1 
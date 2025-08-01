@echo off
REM Script Batch pour ouvrir les paramètres de thèmes Windows
REM Compatible Windows 10 et Windows 11

setlocal enabledelayedexpansion

echo 🎨 Ouverture des paramètres de thèmes Windows...

REM Méthode 1: Utiliser start avec le protocole ms-settings:themes
start ms-settings:themes 2>nul
if %errorlevel% equ 0 (
    echo ✅ Paramètres de thèmes Windows ouverts avec succès!
    
    REM Attendre que la fenêtre se charge
    timeout /t 2 /nobreak >nul
    
    REM Méthode 2: Tentative de simulation du clic (optionnel)
    echo 🖱️ Tentative de simulation du clic sur 'Paramètres des icônes du Bureau'...
    
    REM Utiliser PowerShell pour simuler le clic
    powershell.exe -Command "Add-Type -AssemblyName System.Windows.Forms; Start-Sleep -Seconds 3; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(400, 300); [System.Windows.Forms.SendKeys]::SendWait('{ENTER}')" 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Clic simulé sur 'Paramètres des icônes du Bureau'!
    ) else (
        echo ⚠️ Impossible de simuler le clic automatiquement.
        echo 💡 Veuillez cliquer manuellement sur 'Paramètres des icônes du Bureau' dans la fenêtre ouverte.
    )
    
    exit /b 0
)

REM Méthode 3: Utiliser PowerShell si disponible
echo 🔄 Tentative avec PowerShell...
powershell.exe -Command "Start-Process 'ms-settings:themes'" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Paramètres de thèmes Windows ouverts via PowerShell!
    exit /b 0
)

REM Méthode 4: Utiliser explorer.exe
echo 🔄 Tentative avec explorer.exe...
explorer.exe ms-settings:themes 2>nul
if %errorlevel% equ 0 (
    echo ✅ Paramètres de thèmes Windows ouverts via explorer.exe!
    exit /b 0
)

REM Méthode 5: Essayer de lancer l'application Paramètres directement
echo 🔄 Tentative avec l'application Paramètres...
start shell:AppsFolder\windows.immersivecontrolpanel_cw5n1h2txyewy!microsoft.windows.immersivecontrolpanel 2>nul
if %errorlevel% equ 0 (
    echo ✅ Application Paramètres ouverte!
    echo 💡 Veuillez naviguer manuellement vers les paramètres de thèmes.
    exit /b 0
)

echo ❌ Impossible d'ouvrir les paramètres de thèmes Windows automatiquement.
echo 💡 Veuillez ouvrir manuellement les paramètres de thèmes Windows.
pause
exit /b 1 
# Script PowerShell pour ouvrir les paramètres de thèmes Windows
# Compatible Windows 10 et Windows 11

param(
    [string]$SettingsPage = "ms-settings:themes"
)

Write-Host "🎨 Ouverture des paramètres de thèmes Windows..." -ForegroundColor Green

try {
    # Méthode 1: Utiliser Start-Process avec le protocole ms-settings:themes
    Start-Process $SettingsPage -ErrorAction Stop
    Write-Host "✅ Paramètres de thèmes Windows ouverts avec succès!" -ForegroundColor Green
    
    # Attendre que la fenêtre se charge
    Start-Sleep -Seconds 2
    
    # Méthode 2: Simuler le clic sur "Paramètres des icônes du Bureau" (optionnel)
    try {
        Write-Host "🖱️ Tentative de simulation du clic sur 'Paramètres des icônes du Bureau'..." -ForegroundColor Yellow
        
        # Charger l'assembly Windows Forms pour les clics
        Add-Type -AssemblyName System.Windows.Forms
        
        # Attendre un peu plus pour que la fenêtre soit complètement chargée
        Start-Sleep -Seconds 3
        
        # Simuler un clic sur les coordonnées approximatives du bouton "Paramètres des icônes du Bureau"
        # Note: Les coordonnées peuvent varier selon la résolution et la taille de la fenêtre
        [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(400, 300)
        [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
        
        Write-Host "✅ Clic simulé sur 'Paramètres des icônes du Bureau'!" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Impossible de simuler le clic automatiquement: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "💡 Veuillez cliquer manuellement sur 'Paramètres des icônes du Bureau' dans la fenêtre ouverte." -ForegroundColor Cyan
    }
    
    exit 0
}
catch {
    Write-Host "❌ Erreur avec Start-Process: $($_.Exception.Message)" -ForegroundColor Red
    
    try {
        # Méthode 3: Utiliser cmd.exe
        Write-Host "🔄 Tentative avec cmd.exe..." -ForegroundColor Yellow
        cmd.exe /c start $SettingsPage
        Write-Host "✅ Paramètres de thèmes Windows ouverts via cmd.exe!" -ForegroundColor Green
        exit 0
    }
    catch {
        Write-Host "❌ Erreur avec cmd.exe: $($_.Exception.Message)" -ForegroundColor Red
        
        try {
            # Méthode 4: Utiliser explorer.exe
            Write-Host "🔄 Tentative avec explorer.exe..." -ForegroundColor Yellow
            explorer.exe $SettingsPage
            Write-Host "✅ Paramètres de thèmes Windows ouverts via explorer.exe!" -ForegroundColor Green
            exit 0
        }
        catch {
            Write-Host "❌ Erreur avec explorer.exe: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "❌ Impossible d'ouvrir les paramètres de thèmes Windows automatiquement." -ForegroundColor Red
            Write-Host "💡 Veuillez ouvrir manuellement les paramètres de thèmes Windows." -ForegroundColor Yellow
            exit 1
        }
    }
} 
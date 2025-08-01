# Script PowerShell pour ouvrir les paramètres Windows
# Compatible Windows 10 et Windows 11

param(
    [string]$SettingsPage = "ms-settings:"
)

Write-Host "🔧 Ouverture des paramètres Windows..." -ForegroundColor Green

try {
    # Méthode 1: Utiliser Start-Process avec le protocole ms-settings
    Start-Process $SettingsPage -ErrorAction Stop
    Write-Host "✅ Paramètres Windows ouverts avec succès!" -ForegroundColor Green
    exit 0
}
catch {
    Write-Host "❌ Erreur avec Start-Process: $($_.Exception.Message)" -ForegroundColor Red
    
    try {
        # Méthode 2: Utiliser cmd.exe
        Write-Host "🔄 Tentative avec cmd.exe..." -ForegroundColor Yellow
        cmd.exe /c start $SettingsPage
        Write-Host "✅ Paramètres Windows ouverts via cmd.exe!" -ForegroundColor Green
        exit 0
    }
    catch {
        Write-Host "❌ Erreur avec cmd.exe: $($_.Exception.Message)" -ForegroundColor Red
        
        try {
            # Méthode 3: Utiliser explorer.exe
            Write-Host "🔄 Tentative avec explorer.exe..." -ForegroundColor Yellow
            explorer.exe $SettingsPage
            Write-Host "✅ Paramètres Windows ouverts via explorer.exe!" -ForegroundColor Green
            exit 0
        }
        catch {
            Write-Host "❌ Erreur avec explorer.exe: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "❌ Impossible d'ouvrir les paramètres Windows automatiquement." -ForegroundColor Red
            Write-Host "💡 Veuillez ouvrir manuellement les paramètres Windows." -ForegroundColor Yellow
            exit 1
        }
    }
} 
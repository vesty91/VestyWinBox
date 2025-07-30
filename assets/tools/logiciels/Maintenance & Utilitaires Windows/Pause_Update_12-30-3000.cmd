@echo off
mode con:cols=89 lines=18
color 1F
cd %systemroot%\system32
call :IsAdmin
 
cls
echo "   __  ___                  __  _        _____                 __   _                  "
echo "  /  |/  /___   ____ ___   / / ( )___   / ___/____ ___  ___ _ / /_ (_) ___   ___   ___ "
echo " / /|_/ // _ \ / __// _ \ / _ \|/(_-<  / /__ / __// -_)/ _ \`// __// // _ \ // _\ (_-< "
echo "/_/  /_/ \___//_/  / .__//_//_/ /___/  \___//_/   \__/ \_,_/ \__//_/ \\___////_//___/  "
echo "                  /_/                                                                  "
Reg.exe add "HKLM\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings" /v "ExcludeWUDriversInQualityUpdate" /t REG_DWORD /d "1" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings" /v "PauseFeatureUpdatesStartTime" /t REG_SZ /d "2023-02-18T12:53:30Z" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings" /v "PauseFeatureUpdatesEndTime" /t REG_SZ /d "3000-12-30T12:53:30Z" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings" /v "PauseQualityUpdatesStartTime" /t REG_SZ /d "2023-02-18T12:53:30Z" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings" /v "PauseQualityUpdatesEndTime" /t REG_SZ /d "3000-12-30T12:53:30Z" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings" /v "PauseUpdatesStartTime" /t REG_SZ /d "2023-02-18T12:53:30Z" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings" /v "PauseUpdatesExpiryTime" /t REG_SZ /d "3000-12-30T12:53:30Z" /f
Reg.exe add "HKLM\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings" /v "TrayIconVisibility" /t REG_DWORD /d "0" /f
Exit

:IsAdmin
Reg.exe query "HKU\S-1-5-19\Environment"
If Not %ERRORLEVEL% EQU 0 (
 Cls & Echo You must have administrator rights to continue ... 
 Pause & Exit
)
Cls
goto:eof

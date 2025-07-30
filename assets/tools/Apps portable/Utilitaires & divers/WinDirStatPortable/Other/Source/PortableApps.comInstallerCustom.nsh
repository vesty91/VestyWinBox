;(NSIS Plugins)
!include TextReplace.nsh

;(Custom)
!include ReplaceInFileWithTextReplace.nsh

Var bolCustomCreatedLegacy

!macro CustomCodePreInstall
	${If} ${FileExists} "$INSTDIR\App\AppInfo\AppInfo.ini"
		ReadINIStr $0 "$INSTDIR\App\AppInfo\appinfo.ini" "Version" "PackageVersion"
		${VersionCompare} "$0" "1.2.0.0" $1
		${If} $1 == "2"  ;$0 is older than
			ReadRegStr $1 HKLM "Software\Microsoft\Windows NT\CurrentVersion" "CurrentBuild"
			
			${If} $1 < 7600 ;Windows XP/Vista
				${GetParent} $INSTDIR $1
				${IfNot} ${FileExists} "$1\WinDirStatPortableLegacyWinXP\*.*"
					${GetParent} $INSTDIR $1
					CreateDirectory "$1\WinDirStatPortableLegacyWinXP"
					CopyFiles /SILENT "$INSTDIR\*.*" "$1\WinDirStatPortableLegacyWinXP"
					StrCpy $bolCustomCreatedLegacy true
				${EndIf}	
			${EndIf}
			${ReplaceInFileUTF16LE} "$INSTDIR\Data\settings\WinDirStat.reg" `\Seifert\WinDirStat\` `\WinDirStat\WinDirStat\`
		${EndIf}
	${EndIf}
!macroend

!macro CustomCodePostInstall
	${If} $bolCustomCreatedLegacy == true
		${GetParent} $INSTDIR $1
		Delete "$1\WinDirStatPortableLegacyWinXP\WinDirStatPortable.exe"
		CopyFiles /SILENT "$INSTDIR\Other\Source\Legacy\WinDirStatPortableLegacyWinXP.exe" "$1\WinDirStatPortableLegacyWinXP"
		Delete "$1\WinDirStatPortableLegacyWinXP\App\AppInfo\Launcher\WinDirStatPortable.ini"
		CopyFiles /SILENT "$INSTDIR\Other\Source\Legacy\WinDirStatPortableLegacyWinXP.ini" "$1\WinDirStatPortableLegacyWinXP\App\AppInfo\Launcher"
		WriteINIStr "$1\WinDirStatPortableLegacyWinXP\App\AppInfo\AppInfo.ini" "Format" "Version" "3.8"
		WriteINIStr "$1\WinDirStatPortableLegacyWinXP\App\AppInfo\AppInfo.ini" "Details" "AppID" "WinDirStatPortableLegacyWinXP"
		WriteINIStr "$1\WinDirStatPortableLegacyWinXP\App\AppInfo\AppInfo.ini" "Details" "Name" "WinDirStat Portable (Legacy WinXP)"
		WriteINIStr "$1\WinDirStatPortableLegacyWinXP\App\AppInfo\AppInfo.ini" "Control" "Start" "WinDirStatPortableLegacyWinXP.exe"
		Delete "$1\WinDirStatPortableLegacyWinXP\Other\Source\Readme.txt"
		CopyFiles /SILENT "$INSTDIR\Other\Source\Legacy\Readme.txt" "$1\WinDirStatPortableLegacyWinXP\Other\Source"		
	${EndIf}
!macroend

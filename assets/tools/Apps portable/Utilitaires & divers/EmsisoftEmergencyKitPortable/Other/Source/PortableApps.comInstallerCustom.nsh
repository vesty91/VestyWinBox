!macro CustomCodePreInstall
	System::Call kernel32::GetCurrentProcess()i.s
	System::Call kernel32::IsWow64Process(is,*i.r0)
	ReadRegStr $1 HKLM "Software\Microsoft\Windows NT\CurrentVersion" "CurrentBuild"
	
	${If} $1 < 10000 ;Windows 7/8
	${OrIf} $0 == 0 ;or 32-bit 10
		${If} ${FileExists} "$INSTDIR\App\AppInfo\appinfo.ini"
			ReadINIStr $0 "$INSTDIR\App\AppInfo\appinfo.ini" "Version" "PackageVersion"
			${VersionCompare} $0 "2023.10.0.12134" $R0
			${If} $R0 = 2
				${GetParent} $INSTDIR $1
				${IfNot} ${FileExists} "$1\EmsisoftEmergencyKitPortableLegacy2021\*.*"
					CreateDirectory "$1\EmsisoftEmergencyKitPortableLegacy2021"
					CopyFiles /SILENT "$INSTDIR\*.*" "$1\EmsisoftEmergencyKitPortableLegacy2021"
					WriteINIStr "$1\EmsisoftEmergencyKitPortableLegacy2021\App\AppInfo\AppInfo.ini" "Details" "AppID" "EmsisoftEmergencyKitPortableLegacy2021"
					WriteINIStr "$1\EmsisoftEmergencyKitPortableLegacy2021\App\AppInfo\AppInfo.ini" "Details" "Name" "EmsisoftEmergencyKit Portable (Legacy 2021)"
				${EndIf}	
			${EndIf}
		${EndIf}
	${EndIf}
!macroend

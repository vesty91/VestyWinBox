!macro CustomCodePreInstall
	${If} ${FileExists} "$INSTDIR\App\AppInfo\appinfo.ini"
		ReadINIStr $0 "$INSTDIR\App\AppInfo\appinfo.ini" "Version" "PackageVersion"
		${VersionCompare} $0 "1.3.10.992" $R0
		${If} $R0 == "2"
			RMDir /r "$INSTDIR\Data"
		${EndIf}
	${EndIf}
	${If} ${FileExists} "$INSTDIR\App\Audacity64\help"
		Rename "$INSTDIR\App\Audacity64\help" "$INSTDIR\App\Audacity\help"
		Rename "$INSTDIR\App\Audacity64\Languages" "$INSTDIR\App\Audacity\Languages"
		Rename "$INSTDIR\App\Audacity64\nyquist" "$INSTDIR\App\Audacity\nyquist"
		Rename "$INSTDIR\App\Audacity64\plug-ins" "$INSTDIR\App\Audacity\plug-ins"
	${EndIf}
!macroend

!macro CustomCodePostInstall
	${If} ${FileExists} "$INSTDIR\Data\settings\AudacityPortableSettings.ini"
		ReadINIStr $0 "$INSTDIR\Data\settings\AudacityPortableSettings.ini" "AudacityPortableSettings" "RemoveCManifest"
		${If} $0 == "true"
			Delete "$INSTDIR\App\Audacity\Microsoft.VC90.CRT.manifest"
		${EndIf}
	${EndIf}
!macroend
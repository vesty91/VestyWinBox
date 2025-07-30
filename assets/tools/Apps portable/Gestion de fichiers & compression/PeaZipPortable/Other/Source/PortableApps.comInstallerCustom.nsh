!macro CustomCodePostInstall
	${If} ${FileExists} "$INSTDIR\Data\settings\conf.txt"
	${AndIfNot} ${FileExists} "$INSTDIR\Data\conf\*.*"
		Rename "$INSTDIR\Data\settings" "$INSTDIR\Data\conf"
		CreateDirectory "$INSTDIR\Data\settings"
		Rename "$INSTDIR\Data\conf\PeaZipPortableSettings.ini" "$INSTDIR\Data\settings\PeaZipPortableSettings.ini"
		Delete "$INSTDIR\Data\conf\settings_readme.txt"
	${EndIf}
!macroend
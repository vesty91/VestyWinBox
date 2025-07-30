!macro CustomCodePostInstall
	${If} ${FileExists} "$INSTDIR\Data\settings\FreeCommander.ini"
		CreateDirectory "$INSTDIR\Data\settings\ColorSchemes"
		CopyFiles /SILENT "$INSTDIR\App\DefaultData\settings\ColorSchemes\*.*" "$INSTDIR\Data\settings\ColorSchemes"
	${EndIf}
!macroend

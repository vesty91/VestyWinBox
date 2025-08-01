;(NSIS Plugins)
!include TextReplace.nsh

;(Custom)
!include ReplaceInFileWithTextReplace.nsh

!macro CustomCodePreInstall
	${If} ${FileExists} "$INSTDIR\App\AppInfo\appinfo.ini"
		ReadINIStr $0 "$INSTDIR\App\AppInfo\appinfo.ini" "Version" "PackageVersion"
		${VersionCompare} $0 "2.10.0.2" $R0
		${If} $R0 == 2
			Rename "$INSTDIR\App\gimp\lib\gimp\2.0\plug-ins" "$INSTDIR\Data\plug-ins-pre-2.10"
			RMDir /r "$INSTDIR\App\gimp"
		${EndIf}
	${EndIf}
	${If} ${FileExists} "$EXEDIR\App\gimp64\*.*"
		Rename "$EXEDIR\App\gimp" "$EXEDIR\App\gimp32"
		Rename "$EXEDIR\App\gimp64" "$EXEDIR\App\gimp"
		Rename "$EXEDIR\App\gimp32\etc" "$EXEDIR\App\gimp\etc"
		Rename "$EXEDIR\App\gimp32\share" "$EXEDIR\App\gimp\share"
		Rename "$EXEDIR\App\gimp32\bin" "$EXEDIR\App\gimp\32\bin"
	${EndIf}
!macroend

!macro CustomCodePostInstall
	RMDir "$INSTDIR\App\gimp\lib\gimp\2.0\plug-ins"
	RMDir "$INSTDIR\App\gimp\lib\gimp\2.0"
	RMDir "$INSTDIR\App\gimp\lib\gimp"
	RMDir "$INSTDIR\App\gimp\lib"
	RMDir "$INSTDIR\App\gimp\share"
	RMDir "$INSTDIR\App\gimp"
	RMDir "$INSTDIR\App\gimp32\lib\gimp\2.0\plug-ins"
	RMDir "$INSTDIR\App\gimp32\lib\gimp\2.0"
	RMDir "$INSTDIR\App\gimp32\lib\gimp"
	RMDir "$INSTDIR\App\gimp32\lib"
	RMDir "$INSTDIR\App\gimp32\share"
	RMDir "$INSTDIR\App\gimp32"
	RMDir "$INSTDIR\App\gimp64\lib\gimp\2.0\plug-ins"
	RMDir "$INSTDIR\App\gimp64\lib\gimp\2.0"
	RMDir "$INSTDIR\App\gimp64\lib\gimp"
	RMDir "$INSTDIR\App\gimp64\lib"
	RMDir "$INSTDIR\App\gimp64\share"
	RMDir "$INSTDIR\App\gimp64"
	
	;Fix old files
	${If} ${FileExists} "$INSTDIR\Data\.gimp\*.*"
	${AndIfNot} ${FileExists} "$INSTDIR\Data\GimpAppData\*.*"
		Rename "$INSTDIR\Data\.gimp" "$INSTDIR\Data\GimpAppData"
		CreateDirectory "$INSTDIR\Data\GimpHome"
		Rename "$INSTDIR\Data\GimpAppData\.dbus-keyrings" "$INSTDIR\Data\GimpHome\.dbus-keyrings"
		${ReplaceInFile} "$INSTDIR\Data\GimpAppData\gimprc" "\\.gimp\\" "\\GimpAppData\\"
		${ReplaceInFile} "$INSTDIR\Data\GimpAppData\pluginrc" "\\.gimp\\" "\\GimpAppData\\"
		${ReplaceInFile} "$INSTDIR\Data\GimpAppData\themerc" "\\.gimp\\" "\\GimpAppData\\"
		CreateDirectory "$INSTDIR\Data\GimpAppData\brushes"
		CreateDirectory "$INSTDIR\Data\GimpAppData\curves"
		CreateDirectory "$INSTDIR\Data\GimpAppData\dynamics"
		CreateDirectory "$INSTDIR\Data\GimpAppData\environ"
		CreateDirectory "$INSTDIR\Data\GimpAppData\filters"
		CreateDirectory "$INSTDIR\Data\GimpAppData\fractalexplorer"
		CreateDirectory "$INSTDIR\Data\GimpAppData\gfig"
		CreateDirectory "$INSTDIR\Data\GimpAppData\gflare"
		CreateDirectory "$INSTDIR\Data\GimpAppData\gimpressionist"
		CreateDirectory "$INSTDIR\Data\GimpAppData\icons"
		CreateDirectory "$INSTDIR\Data\GimpAppData\interpreters"
		CreateDirectory "$INSTDIR\Data\GimpAppData\levels"
		CreateDirectory "$INSTDIR\Data\GimpAppData\modules"
		CreateDirectory "$INSTDIR\Data\GimpAppData\palettes"
		CreateDirectory "$INSTDIR\Data\GimpAppData\patterns"
		CreateDirectory "$INSTDIR\Data\GimpAppData\modules"
		CreateDirectory "$INSTDIR\Data\GimpAppData\plug-ins"
		CreateDirectory "$INSTDIR\Data\GimpAppData\plug-in-settings"
		CreateDirectory "$INSTDIR\Data\GimpAppData\scripts"
		CreateDirectory "$INSTDIR\Data\GimpAppData\templates"
		CreateDirectory "$INSTDIR\Data\GimpAppData\themes"
		CreateDirectory "$INSTDIR\Data\GimpAppData\tmp"
		CreateDirectory "$INSTDIR\Data\GimpAppData\tool-presets"
	${EndIf}
	
	${If} $bolLegacyOSUpgrade == true
		${GetParent} $INSTDIR $1 
		${If} ${FileExists} "$1\GIMPPortableLegacyWin7\Data\.gimp\*.*"
		${AndIfNot} ${FileExists} "$1\GIMPPortableLegacyWin7\Data\GimpAppData\*.*"
			Rename "$1\GIMPPortableLegacyWin7\Data\.gimp" "$1\GIMPPortableLegacyWin7\Data\GimpAppData"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpHome"
			Rename "$1\GIMPPortableLegacyWin7\Data\GimpAppData\.dbus-keyrings" "$1\GIMPPortableLegacyWin7\Data\GimpHome\.dbus-keyrings"
			${ReplaceInFile} "$1\GIMPPortableLegacyWin7\Data\GimpAppData\gimprc" "\\.gimp\\" "\\GimpAppData\\"
			${ReplaceInFile} "$1\GIMPPortableLegacyWin7\Data\GimpAppData\pluginrc" "\\.gimp\\" "\\GimpAppData\\"
			${ReplaceInFile} "$1\GIMPPortableLegacyWin7\Data\GimpAppData\themerc" "\\.gimp\\" "\\GimpAppData\\"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\brushes"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\curves"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\dynamics"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\environ"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\filters"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\fractalexplorer"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\gfig"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\gflare"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\gimpressionist"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\icons"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\interpreters"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\levels"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\modules"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\palettes"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\patterns"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\modules"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\plug-ins"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\plug-in-settings"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\scripts"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\templates"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\themes"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\tmp"
			CreateDirectory "$1\GIMPPortableLegacyWin7\Data\GimpAppData\tool-presets"
		${EndIf}
		${If} ${FileExists} "$1\GIMPPortableLegacyWin7\App\DefaultData\.gimp\*.*"
			Rename "$1\GIMPPortableLegacyWin7\App\DefaultData\.gimp" "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpHome"
			Rename "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\.dbus-keyrings" "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpHome\.dbus-keyrings"
			${ReplaceInFile} "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\gimprc" "\\.gimp\\" "\\GimpAppData\\"
			${ReplaceInFile} "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\pluginrc" "\\.gimp\\" "\\GimpAppData\\"
			${ReplaceInFile} "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\themerc" "\\.gimp\\" "\\GimpAppData\\"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\brushes"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\curves"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\dynamics"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\environ"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\filters"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\fractalexplorer"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\gfig"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\gflare"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\gimpressionist"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\icons"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\interpreters"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\levels"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\modules"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\palettes"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\patterns"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\modules"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\plug-ins"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\plug-in-settings"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\scripts"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\templates"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\themes"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\tmp"
			CreateDirectory "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\tool-presets"
		${EndIf}
		Delete "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData\gimprc"
		CopyFiles /SILENT "$INSTDIR\Other\Source\Legacy\LegacyWin7\gimprc" "$1\GIMPPortableLegacyWin7\App\DefaultData\GimpAppData"
		CopyFiles /SILENT "$INSTDIR\Other\Source\Legacy\LegacyWin7\ReadINIStrWithDefault.nsh" "$1\GIMPPortableLegacyWin7\App\AppInfo\Launcher"
		Delete "$1\GIMPPortableLegacyWin7\help.html"
		CopyFiles /SILENT "$INSTDIR\help.html" "$1\GIMPPortableLegacyWin7"
	${EndIf}
	
	;Sadly does not work yet but may in the future to speed startup after upgrade
	Delete "$INSTDIR\Data\GimpAppData\pluginrc"
	CopyFiles /SILENT "$INSTDIR\App\DefaultData\GimpAppData\pluginrc" "$INSTDIR\Data\GimpAppData"
!macroend

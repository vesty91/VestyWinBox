Var CustomLegacyCreated

!macro CustomCodePostInstall
	CopyFiles /SILENT "$INSTDIR\App\Chrome-bin64\Dictionaries" "$INSTDIR\App\64\Chrome-bin\Dictionaries"
	RMDir /r "$INSTDIR\App\Chrome-bin64"
	Rename "$INSTDIR\App\64\Chrome-bin" "$INSTDIR\App\Chrome-bin64"
	RMDir /r "$INSTDIR\App\64"
!macroend
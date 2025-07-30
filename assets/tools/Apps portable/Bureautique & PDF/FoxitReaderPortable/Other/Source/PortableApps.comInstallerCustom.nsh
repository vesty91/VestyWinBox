;(NSIS Plugins)
!include TextReplace.nsh

;(Custom)
!include ReplaceInFileWithTextReplace.nsh

!macro CustomCodePostInstall
	${If} ${FileExists} "$INSTDIR\Data\settings\*.*"
		${If} ${FileExists} "$INSTDIR\Data\settings\FoxitReaderPortable11.0.reg"
		${AndIfNot} ${FileExists} "$INSTDIR\Data\settings\FoxitReaderPortable12.0.reg"
			Rename "$INSTDIR\Data\settings\FoxitReaderPortable11.0.reg" "$INSTDIR\Data\settings\FoxitReaderPortable12.0.reg"
			Rename "$INSTDIR\Data\settings\FoxitEditorPortable11.0.reg" "$INSTDIR\Data\settings\FoxitEditorPortable12.0.reg"
			${ReplaceInFileUTF16LE} "$INSTDIR\Data\settings\FoxitReaderPortable12.0.reg" `Foxit PDF Reader 11.0` `Foxit PDF Reader 12.0`
			${ReplaceInFileUTF16LE} "$INSTDIR\Data\settings\FoxitEditorPortable12.0.reg" `Foxit PDF Editor 11.0` `Foxit PDF Editor 12.0`			
		${EndIf}
		${If} ${FileExists} "$INSTDIR\Data\settings\FoxitReaderPortable12.0.reg"
		${AndIfNot} ${FileExists} "$INSTDIR\Data\settings\FoxitReaderPortable.reg"
			Rename "$INSTDIR\Data\settings\FoxitReaderPortable12.0.reg" "$INSTDIR\Data\settings\FoxitReaderPortable.reg"
			Rename "$INSTDIR\Data\settings\FoxitEditorPortable12.0.reg" "$INSTDIR\Data\settings\FoxitEditorPortable.reg"
			${ReplaceInFileUTF16LE} "$INSTDIR\Data\settings\FoxitReaderPortable.reg" `Foxit PDF Reader 12.0` `Foxit PDF Reader\Continuous`
			${ReplaceInFileUTF16LE} "$INSTDIR\Data\settings\FoxitEditorPortable.reg" `Foxit PDF Editor 12.0` `Foxit PDF Editor\Continuous`			
		${EndIf}
		
		${If} ${FileExists} "$INSTDIR\Data\Addon\Foxit PDF Reader\*.*"
			Delete "$INSTDIR\Data\Addon\Foxit PDF Reader\FoxitPDFReaderUpdater.exe"
			CopyFiles /SILENT "$INSTDIR\App\DefaultData\Addon\Foxit PDF Reader\FoxitPDFReaderUpdater.exe"  "$INSTDIR\Data\Addon\Foxit PDF Reader"
			Delete "$INSTDIR\Data\Addon\Foxit PDF Reader\lang\en-US\*.*"
			CopyFiles /SILENT "$INSTDIR\App\DefaultData\Addon\Foxit PDF Reader\lang\en-US\*.*"  "$INSTDIR\Data\Addon\Foxit PDF Reader\lang\en-US"
		${Else}
			CreateDirectory "$INSTDIR\Data\Addon"
			CopyFiles /SILENT "$INSTDIR\App\DefaultData\Addon\*.*" "$INSTDIR\Data\Addon"
		${EndIf}
		${If} ${FileExists} "$INSTDIR\Data\UserSign\*.*"
			CreateDirectory "$INSTDIR\Data\FoxitPDFReader"
			CreateDirectory "$INSTDIR\Data\FoxitPDFReader\InstaSign"
			Rename "$INSTDIR\Data\UserSign" "$INSTDIR\Data\FoxitPDFReader\InstaSign\UserSign"
		${EndIf}
		${If} ${FileExists} "$INSTDIR\Data\FormFiller\*.*"
			CreateDirectory "$INSTDIR\Data\FoxitPDFReader"
			Rename "$INSTDIR\Data\FormFiller" "$INSTDIR\Data\FoxitPDFReader\FormFiller"
		${EndIf}
	${EndIf}
!macroend
#Region ;**** Directives created by AutoIt3Wrapper_GUI ****
#AutoIt3Wrapper_Compression=3
#AutoIt3Wrapper_Change2CUI=y
#AutoIt3Wrapper_Run_Au3Stripper=y
#Au3Stripper_Parameters=/rm /pe
#EndRegion ;**** Directives created by AutoIt3Wrapper_GUI ****
AutoItSetOption("MustDeclareVars", 1)
#region ---Head--
#include <WinAPIConv.au3>
#include <Math.au3>

Const $pinMAMERegKey = "HKEY_CURRENT_USER\Software\Freeware\Visual PinMame"
Const $pinMAMERegKeyShort = "HKCU\Software\Freeware\Visual PinMame"
Const $volumeRegKey = "volume"
Const $dmdRegKey = "showpindmd"
#endregion ---Head---

cmdLineExecute()

Func cmdLineExecute()
	Local $mode, $command, $romname, $value
	If $CmdLine[0] < 3 Then Exit(5)
	$mode = $CmdLine[1]
	$command = $CmdLine[2]
	$romname = $CmdLine[3]
	If $CmdLine[0] = 4 Then
		$value = Number($CmdLine[4])
	EndIf
	If ($mode = "-write") And ($CmdLine[0] < 4) Then Exit(5)
	If ($romname = "default") Or ($romname = "globals") Then Exit(5)
	If ($mode = "-read") And ($command = "volume") Then
		Exit(getDecimalVolumeFromRegistry($romname))
	ElseIf ($mode = "-write") And ($command = "volume") Then
		Exit(writeDecimalVolumeToRegistry($romname, $value))
	ElseIf ($mode = "-read") And $command = "showpindmd" Then
		Exit(getShowDMDFromRegistry($romname))
	ElseIf ($mode = "-write") And ($command = "showpindmd") Then
		Exit(writeShowDMDToRegistry($romname, $value))
	EndIf
	Exit(5)
EndFunc

Func volumeValueExists($romName)
	Local $rawVolume = RegRead($pinMAMERegKey & "\" & $romName, $volumeRegKey)
	Return @error = 0 ; true if no error
EndFunc

Func getDecimalVolumeFromRegistry($romName)
	If volumeValueExists($romName) Then
		Local $rawVolume = RegRead($pinMAMERegKey & "\" & $romName, $volumeRegKey)
		Local $value = _WinAPI_DWordToInt($rawVolume)
		ConsoleWrite("ROM: " & $romname & ". volume: " & $value & @CRLF)
		Return $value
	EndIf
	Return 5
EndFunc

Func writeDecimalVolumeToRegistry($romName, $value)
	If ($value < 1) And ($value >= -32) And volumeValueExists($romName) Then
		Local $hexValue = _WinAPI_IntToDWord($value)
		RegWrite($pinMAMERegKey & "\" & $romName, $volumeRegKey, "REG_DWORD", $hexValue)
		Return @error = 0 ? 0 : 5 ; true if no error
	EndIf
	Return 5
EndFunc

Func dmdValueExists($romName)
	Local $value = RegRead($pinMAMERegKey & "\" & $romName, $dmdRegKey)
	Return @error = 0 ; true if no error
EndFunc

Func getShowDMDFromRegistry($romName)
	If dmdValueExists($romName) Then
		Local $value = RegRead($pinMAMERegKey & "\" & $romName, $dmdRegKey)
		ConsoleWrite("ROM: " & $romname & ". showPinDMD: " & $value & @CRLF)
		Return $value
	EndIf
	Return 5
EndFunc

Func writeShowDMDToRegistry($romName, $value)
	If ($value >= 0) And ($value <= 1) And dmdValueExists($romName) Then
		RegWrite($pinMAMERegKey & "\" & $romName, $dmdRegKey, "REG_DWORD", $value)
		Return @error = 0 ? 0 : 5 ; true if no error
	EndIf
	Return 5
EndFunc

/*
#################################################
# PinMAME functions for PinballY by Tengri      #
#################################################

Allows to control ROM volume & DMD of PinMAME conveniently from PinballY
- Showpindmd (0 / 1) shows or hides the DMD controlled by PinMAME. Disabling the DMD is useful for older ROM based tables with alphanumeric displays, where PinMAME is showing basic numbers only on the DMD.
- Volume (0 to -32) attenuates the volume of the ROM sound from PinMAME. This allows to balance out the volume coming from the backbox speakers vs. the volume of the playfield sound. This is for older ROM based tables, which do not have a DMD menu with volume control. 0 is the loudest (default). I have never needed values below -16. So this is the range being shown in the menu. It is usually sufficient to go in steps of 2, as I have never needed the steps to be finer.
- The only change that needs to be done to the script is the scriptpath itself. It defaults to "C:\\PinballY\\Scripts\\" which should work out of the box for most installations.

The registry key for the ROM is retrieved from PinballYs metadata. In my experience, this works quite well for 95% of the tables that I have used it for so far.

The changes to the Windows registry are being done by a small helper application, built with AutoIt3. You can use the provided EXE or build it yourself from source.

*/

const ScriptPath = "C:\\PinballY\\Scripts\\";
var PinMAMEfunctionEXE = "PinMAME_functions.exe";
var TempFileName = "./Scripts/PinMAME_functions.temp";
var fso = createAutomationObject("Scripting.FileSystemObject");
var PinMAME_menu = command.allocate("openPinMAMEmenu");

mainWindow.on("menuopen", ev => {
    if (ev.id == "main") {
		var info = gameList.getWheelGame(0);
		if (null == info) return;
		var rom = info.resolveROM();
		if (null == rom) return;
		if (typeof rom.vpmRom == "undefined") return;
		ev.addMenuItem({after: command.GameInfo}, { title: "PinMAME/ROM options", cmd: PinMAME_menu });	
		if (fso.FileExists(TempFileName)) {
			fso.DeleteFile(TempFileName);
		}
		Shell32.ShellExecuteW(null, "open", ScriptPath + PinMAMEfunctionEXE, "-read all " + rom.vpmRom, ScriptPath, SW_HIDE);
    }
});

var Dummy   = command.allocate("Dummy");
var DMD_on   = command.allocate("1");
var DMD_off  = command.allocate("0");
var VOL_cmds = [
			command.allocate("0"),
			command.allocate("-2"),
			command.allocate("-4"),
			command.allocate("-6"),
			command.allocate("-8"),
			command.allocate("-10"),
			command.allocate("-12"),
			command.allocate("-14"),
			command.allocate("-16")
	];

mainWindow.on("command", ev => {
    if (ev.id == PinMAME_menu) {
		var info = gameList.getWheelGame(0);
		if (null == info) return;
		var rom = info.resolveROM();
		if (null == rom) return;
		if (typeof rom.vpmRom == "undefined") return;
		var readRom = "";
		var readPinDMD = "99";
		var readVolume = "99";
		if (fso.FileExists(TempFileName)) {
			var file = fso.OpenTextFile(TempFileName, 1, false, 0);
			readRom = file.ReadLine();
			if (readRom == rom.vpmRom) {
				readPinDMD = file.ReadLine();
				readVolume = file.ReadLine();
			}
			file.Close();
		}
		var volTitles = ["  0", " -2", " -4", " -6", " -8", "-10", "-12", "-14", "-16"];
		var volSelection = [false, false, false, false, false, false, false, false];
		for (var i = 0; i < volTitles.length; i++) {
			volSelection[i] = (volTitles[i].trim() == readVolume) ? true : false;
			if (volTitles[i].trim() == readVolume) {
				volTitles[i] = ">>>  " + volTitles[i] + "  <<<";
			}
		}
		mainWindow.showMenu("custom.openPinMAMEmenu", [
			{title: "ROM: " + rom.vpmRom, Dummy,},
			{cmd: -1},
			{title: "Pin DMD", Dummy,},
			{title: (readPinDMD == "1" ? ">>>  enabled  <<<" : "enable"), cmd: DMD_on,},
			{title: (readPinDMD == "0" ? ">>>  disabled  <<<" : "disable"), cmd: DMD_off,},
			{cmd: -1},
			{title: "ROM volume", Dummy,},
			{title: volTitles[0], cmd: VOL_cmds[0], radio: volSelection[0],},
			{title: volTitles[1], cmd: VOL_cmds[1], radio: volSelection[1],},
			{title: volTitles[2], cmd: VOL_cmds[2], radio: volSelection[2],},
			{title: volTitles[3], cmd: VOL_cmds[3], radio: volSelection[3],},
			{title: volTitles[4], cmd: VOL_cmds[4], radio: volSelection[4],},
			{title: volTitles[5], cmd: VOL_cmds[5], radio: volSelection[5],},
			{title: volTitles[6], cmd: VOL_cmds[6], radio: volSelection[6],},
			{title: volTitles[7], cmd: VOL_cmds[7], radio: volSelection[7],},
			{title: volTitles[8], cmd: VOL_cmds[8], radio: volSelection[8],},
			{cmd: -1},
			{title: "Cancel", cmd: command.MenuReturn}
		]);
	}
});

mainWindow.on("command", ev => {
	var info = gameList.getWheelGame(0);
	if (null == info) return;
	var rom = info.resolveROM();
	if (null == rom) return;
	if (typeof rom.vpmRom == "undefined") return;
	var parameters = "";
	if ((ev.id == DMD_on) || (ev.id == DMD_off)) {
		parameters = "-write showpindmd " + rom.vpmRom + " " + ev.name; // ev.name is equal to 1 or 0
	}
	for (var i = 0; i < VOL_cmds.length; i++) {
		if (ev.id == VOL_cmds[i]) {
			parameters = "-write volume " + rom.vpmRom + " " + ev.name; // ev.name is equal to the volume
			break;
		}
	}
	if (parameters == "") return;
	Shell32.ShellExecuteW(null, "open", ScriptPath + PinMAMEfunctionEXE, parameters, ScriptPath, SW_HIDE);
//	mainWindow.message(parameters);
});

var Shell32 = dllImport.bind("Shell32.dll", `
    HINSTANCE ShellExecuteW(
        HWND    hwnd,
        LPCWSTR lpOperation,
        LPCWSTR lpFile,
        LPCWSTR lpParameters,
        LPCWSTR lpDirectory,
        INT     nShowCmd
    );
`);

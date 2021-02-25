//################################################################AWI Start Batch file on Menu Press###############################################
// You will not be able to use this script 1:1
// it shows how to 
// - create a menu item (Ambilight OFF)
// - a sub menu with 4 items (choose colors)
// - call a batch file and hand over a parameter

// in my case SmartHome  (IObroker) is triggered via curl and smarthome sets a WLED (ESP8266) to a predefined color animation
// this allows me to change UnderCabinet LEDS to be controlled via Alexa, Telegram, ...
// this could also be done by a direct URL call instead of going the extra mile over a batch file.
// but i guess using a batch file might provide a better "pattern" to create your own usecase.
// e.g. exchange some files, ...



let Ambi_off = command.allocate("TurnAmbiOff"); // A function in main menu 
let Ambi_menu = command.allocate("OpenAmbilight");   // This is the "entrance" into the submenu

//lets define the menu and functions

mainWindow.on("menuopen", ev => { // when main menu is triggered
    if (ev.id == "main") { 
        ev.addMenuItem({after: command.RateGame}, // add item after "Rate Game"
            { title: "Ambilight: off", cmd: Ambi_off }); // show "Ambilight off" -> use command "Ambi_off" 
		ev.addMenuItem({ after: command.PlayGame },    // this is the trigger for the SUB menu, right after "play game" on the very top 
                { title: "Set Ambilight Color", cmd: Ambi_menu });	
    }
});



// Lets "define" the functions of the sub menu
// 4 colors will be provided
let Ambi_sub_blue   = command.allocate("blue");
let Ambi_sub_green  = command.allocate("green"); 
let Ambi_sub_red = command.allocate("red");
let Ambi_sub_white  = command.allocate("white");

// if Submenu was triggered
mainWindow.on("command", ev => {
    if (ev.id == Ambi_menu) {
				mainWindow.showMenu("custom.OpenAmbilight", 
				            [
								{   //submenu blue
									title: "Ambilight: blue",
									cmd: Ambi_sub_blue,
								},
								{  //submenu green
									title: "Ambilight: green",
									cmd: Ambi_sub_green,
								},
								{  //submenu start red
									title: "Ambilight: red",
									cmd: Ambi_sub_red,
								},
								{  // separator line
								    cmd: -1 
								},  
								{  //submenu white
									title: "Ambilight: white",
									cmd: Ambi_sub_white,
								},
							    {  // separator line
								    cmd: -1 
								},  
								{  // leave submenu 
								   title: "Cancel", cmd: command.MenuReturn 
								}
							]);
	}
});


// now finally we can check what was selected and trigger the action
mainWindow.on("command", ev => {
	let AmbiColor = "red"; //just as dummy
	//if green was selected > save " green" in a variable
	if (ev.id == Ambi_sub_blue) {AmbiColor = " blue";}
    if (ev.id == Ambi_sub_green) {AmbiColor = " green";}
    if (ev.id == Ambi_sub_red) {AmbiColor = " red";}
    if (ev.id == Ambi_sub_white) {AmbiColor = " warmwhite";}
	if (ev.id == Ambi_off)  {AmbiColor = " off";}

    //if any of our commands have been recognized --> do something
	if ((ev.id == Ambi_off) || 
		(ev.id == Ambi_sub_blue) || 
		(ev.id == Ambi_sub_green) || 
		(ev.id == Ambi_sub_red) || 
		(ev.id == Ambi_sub_white)
         ){
        
		// run the command
		// call batch file (hidden mode) and handover the Color as parameter
        let result = Shell32.ShellExecuteW(null, "open",
            "c:\\PinballY\\scripts\\SetAmbi.bat", AmbiColor,
            "c:\\PinballY\\scripts\\", SW_HIDE);

        // The result of ShellExecute() is a fake handle value that we
        // have to interpret as an integer to make sense of.  A value
        // higher than 32 indicates success; a value 32 or lower is an
        // error code.  See the Windows SDK documentation for details.
        if (result.toNumber() > 32)
        {
            // success!  do any follow-up here
        }
        else
        {
            // launch failed
            mainWindow.message("Program launch failed (code " + result.toNumber() + ")", "error");
        }
    }
});

let Shell32 = dllImport.bind("Shell32.dll", `
    HINSTANCE ShellExecuteW(
        HWND    hwnd,
        LPCWSTR lpOperation,
        LPCWSTR lpFile,
        LPCWSTR lpParameters,
        LPCWSTR lpDirectory,
        INT     nShowCmd
    );
`);

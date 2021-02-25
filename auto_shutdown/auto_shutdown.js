//
//	Automatic power off if no activity in attract mode
//	R.Lincoln	Feb 2021
//
//	Revised to overwrite the first attract status line
//	There must be at least one attract mode status line with any text for this to work
//	Adding/removing status lines appears to make PinballY unstable
//
//
let myPOMinutes		= 60;   // set minutes of inactivity to trigger "powerOff"
let myPOToGo		= 0;
let myPOInterval	= 0;
let PowerOff_log = true; // set to false to disable logfile creation

let myPOStatus = mainWindow.statusLines.attract;

//	Entering attract mode - start the timer, add a countdown status line
//
function auto_shutdown_start(ev) {
 if (PowerOff_log) {			logfile.log("[PowerOff] Start id %d", myPOInterval); }

	myPOToGo = myPOMinutes;
	myPOTick();
	myPOInterval = setInterval(myPOTick, 60*1000);
}

//	Leaving attract mode - stop the timer, remove the countdown message
//
function auto_shutdown_end(ev) {
	 if (PowerOff_log) {		 logfile.log("[PowerOff] End id %d", myPOInterval); }

	clearInterval(myPOInterval);
}

//	Tick - runs every minute when attract is inactive
//	Countdown - if !0 - update message, else power off
//
function myPOTick() {
 if (PowerOff_log) {	logfile.log("[PowerOff] Tick togo %d", myPOToGo);}

	if (myPOToGo > 0) {
		myPOStatus.setText(0, "Auto power off in " + myPOToGo + " minutes");
	} else {
        logfile.log("[PowerOff] Powering off - inactivity timer reached"); 
//		mainWindow.doCommand(command.Quit);			// uncomment for testing
		mainWindow.doCommand(command.PowerOffConfirm);
	};
	myPOToGo -= 1;
}

//	Setup callback hooks
//

 if (PowerOff_log) { logfile.log("[PowerOff] Initialised"); }
mainWindow.on("attractmodestart", auto_shutdown_start);
mainWindow.on("attractmodeend", auto_shutdown_end);

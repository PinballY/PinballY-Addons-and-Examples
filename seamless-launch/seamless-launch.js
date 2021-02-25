/*
 * Worked Example for seamless table launch.
 * Continues to show playfield video while launching tables.
 * 
 * To use, add the following to 'PinballY\Scripts\main.js`
 * import 'seamless-launch.js'
 * 
 * Full documentation:
 * http://mjrnet.org/pinscape/downloads/PinballY/Help/SeamlessLoadingExample.html
 */

mainWindow.on("launchoverlayshow", ev => {
    mainWindow.showWheel(false);
    mainWindow.setUnderlay("");
    ev.preventDefault();
});

mainWindow.on("launchoverlayhide", ev => {
    mainWindow.showWheel(true);
});
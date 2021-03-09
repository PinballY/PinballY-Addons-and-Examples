/*
 * Worked Example for seamless table launch with a "spinner"
 * Continues to show playfield video while launching tables.
 * 
 * To use, add the following to 'PinballY\Scripts\main.js`
 * import 'seamless-launch.js'
 * 
 * Full documentation:
 * http://mjrnet.org/pinscape/downloads/PinballY/Help/SeamlessLoadingExample.html
 */
mainWindow.on("launchoverlayshow", ev => {
    // Put your transparent video in PinballY\Media\Videos
    // It should be named 'Loading.xxx' where 'xxx' is the usual mp4, avi, etc.
    let loadingVideo = gameList.resolveMedia("Videos", "Loading", "video");
    mainWindow.launchOverlay.bg.loadVideo(loadingVideo);
    mainWindow.showWheel(false);
    mainWindow.setUnderlay("");
    ev.preventDefault();
});

mainWindow.on("launchoverlayhide", ev => {
    mainWindow.showWheel(true);
});
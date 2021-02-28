/*
##################################################################
# original script found at https://github.com/vbousquet/flexdmd  #
##################################################################
# images by: fr33styler                                          #    
# https://www.dietle.de/projekt-vpin-virtueller-flipper/         #
##################################################################
# slight adjustments by GSadventure                              #
##################################################################
	Custom DMD screen script that shows informations on the selected game (more or less the same than PinballY) using custom medias (animated company logo, table title screen):
	
	- Shows image/video from the 'dmds/manufacturers' subfolder (hardcoded in the script)
	- Shows image/video from the 'dmds/titles' subfolder if they match the media name of the table
	- Shows highscores
	- Shows statistics
	- Can check for PinballY updates and display if any on the main screen (disabled by default)

	TODO:
	- GameName can not be modified for some reason to be understood
	- Missing Midway, Spooky Pinball logo animation
	- Missing animated logo for original tables
	- Move to FlexDMD API instead of UltraDMD when PinballY will fully marshall COM objects, and add more fancy animations
*/


//-----------------------------------------------------------------------------------------------//

// For debugging purposes
function getMethods(obj) {
  var result = [];
  for (var id in obj) {
    try {
      result.push(id + ": " + obj[id].toString() + " / frozen=" + Object.isFrozen(obj[id]) + " / sealed=" + Object.isSealed(obj[id]) + " / type=" + typeof(obj[id]));
    } catch (err) {
      result.push(id + ": inaccessible");
    }
  }
  return result;
}

Number.prototype.toHHMMSS = function () {
    var sec_num = this;
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

Number.prototype.toDDHHMMSS = function () {
    var sec_num = this;
    var days   = Math.floor(sec_num / 86400);
    var hours   = Math.floor((sec_num - (days * 86400))/ 3600);
    var minutes = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60);
    var seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return days+"d "+hours+':'+minutes+':'+seconds;
}

//-----------------------------------------------------------------------------------------------//
// Play a video, without looping, adapting to the actual length of the video
function queueVideo(filename, transitionIn, transitionOut, transitionMargin) {
	if (filename.endsWith(".gif")) {
		let video = dmd.NewVideo(String(filename), String(filename));
		let id = udmd.RegisterVideo(2, false, filename);
		udmd.DisplayScene00(id.toString(), "", 15, "", 15, transitionIn, video.Length * 1000 - transitionMargin, transitionOut);
	} else {
		udmd.DisplayScene00(filename, "", 15, "", 15, transitionIn, 5000 - transitionMargin, transitionOut);
	}
}

// Handle DMD updates
let dmd = null;
let udmd = null;
let hiscores = {};
let info = null;
let shownInfo = null;
let loopCount = 0;
let fso = createAutomationObject("Scripting.FileSystemObject");
let updater;
let manufacturers = {
	"Aliens vs Pinball": ["./Scripts/dmds/manufacturers/Aliens vs Pinball.gif"],
	"Bally": ["./Scripts/dmds/manufacturers/bally.gif"],
	"Bethesda Pinball": ["./Scripts/dmds/manufacturers/Bethesda Pinball.gif"],
	"Capcom": ["./Scripts/dmds/manufacturers/capcom.gif"],
	"Data East": ["./Scripts/dmds/manufacturers/dataeast-1.gif", "./Scripts/dmds/manufacturers/dataeast-2.gif"],
	"Foxnext Games": ["./Scripts/dmds/manufacturers/Foxnext Games.gif"],
	"Gottlieb": ["./Scripts/dmds/manufacturers/gottlieb.gif"],
	"Jurassic Pinball": ["./Scripts/dmds/manufacturers/Jurassic Pinball.gif"],
	"Marvel": ["./Scripts/dmds/manufacturers/Marvel.gif"],
	"Midway": ["./Scripts/dmds/manufacturers/bally.gif"],
	"Premier": ["./Scripts/dmds/manufacturers/premier.gif"],
	"Rowamet": ["./Scripts/dmds/manufacturers/Rowamet.gif"],	
	"Sega": ["./Scripts/dmds/manufacturers/sega.gif"],
	"Spooky": ["./Scripts/dmds/manufacturers/Spooky.gif"],
	"Star Wars Pinball": ["./Scripts/dmds/manufacturers/Star Wars Pinball.gif"],
	"Stern": ["./Scripts/dmds/manufacturers/stern.gif"],
	"Taito": ["./Scripts/dmds/manufacturers/Taito.gif"],
	"The Walking Dead": ["./Scripts/dmds/manufacturers/The Walking Dead.gif"],
	"Universal Pinball": ["./Scripts/dmds/manufacturers/Universal Pinball.gif"],
	"Williams": ["./Scripts/dmds/manufacturers/williams.gif"],
	"WilliamsFX3Pinball": ["./Scripts/dmds/manufacturers/williams.gif"],
	"VPX": ["./Scripts/dmds/manufacturers/VPX.gif"],
	"VALVe": ["./Scripts/dmds/manufacturers/VALVe.gif"],
	"Zaccaria": ["./Scripts/dmds/manufacturers/Zaccaria.gif"],
	"Zen Studios": ["./Scripts/dmds/manufacturers/Zen Studios.gif"]
}
// logfile.log(getMethods(dmd).join("\n"));
function TestMarshalling() {
	dmd.LockRenderThread();
	let video = dmd.NewVideo("Manufacturer", "./Scripts/dmds/manufacturers/bally.gif");
	logfile.log(getMethods(video).join("\n"));
	// This will fail due to a marshalling problem
	dmd.Stage.AddActor(video);
	dmd.UnlockRenderThread();
}
function UpdateDMD() {
	if (updater !== undefined) clearTimeout(updater);
	updater = undefined;

	if (dmd == null) {
		dmd = createAutomationObject("FlexDMD.FlexDMD");
		dmd.GameName = "";
		dmd.Width = 128;
		dmd.Height = 32;
		dmd.Show = true;
		dmd.Run = true;
		udmd = dmd.NewUltraDMD();
	}
	
	if (dmd.Run == false) return;

	if (info == null) return;

	if (udmd.IsRendering() && shownInfo != null && info.id == shownInfo.id) {
		// Add a timeout later for when the render queue will be finished
		updater = setTimeout(UpdateDMD, 1000);
		return;
	}
	
	dmd.LockRenderThread();

	if (shownInfo == null || info.id != shownInfo.id) {
		loopCount = 0;
		shownInfo = info;
	} else {
		loopCount++;
	}			

	udmd.CancelRendering();

	if (loopCount == 0) {
		/*let rom = info.resolveROM();
		logfile.log("> Update DMD for:");
		logfile.log("> rom: '".concat(rom.vpmRom, "'"));
		logfile.log("> manufacturer:", info.manufacturer);
		logfile.log("> title:", info.title);
		logfile.log("> year:", info.year);
		logfile.log("> Table type: ", info.tableType);
		logfile.log("> Highscore style: ", info.highScoreStyle);
		if (rom.vpmRom == null) {
			dmd.GameName = "";
		} else {
			dmd.GameName = rom.vpmRom.toString();
		}*/
	}

	
	// Title
	var hasTitle = false;
	if (info.mediaName != null) {
		var extensions = [".gif", ".avi", ".png"];
		for (var i = 0; i < extensions.length; i++) {
			if (fso.FileExists("./Scripts/dmds/titles/" + info.mediaName + extensions[i])) {
				queueVideo("./Scripts/dmds/titles/" + info.mediaName + extensions[i], 0, 8, transitionMargin);
				hasTitle = true;
				break;
			}
		}
	}
	if (!hasTitle) {
		var name = info.title.trim();
		var subname = "";
		if (name.indexOf('(') != -1) {
			var sep = info.title.indexOf('(');
			name = info.title.slice(0, sep - 1).trim();
		}
		if (name.length >= 16) {
			var split = 16;
			for (var i = 15; i > 0; i--) {
				if (name.charCodeAt(i) == 32) {
					subname = name.slice(i).trim();
					name = name.slice(0, i).trim();
					break;
				}
			}
		}
		udmd.DisplayScene00("FlexDMD.Resources.dmds.black.png", name, 15, subname, 15, 0, 5000, 8);
	}

	// Manufacturer
	/*
	let transitionMargin = (20 * 1000) / 60;
	if (info.manufacturer in manufacturers) {
		var medias = manufacturers[info.manufacturer];
		var media = medias[Math.floor(Math.random() * medias.length)];
		queueVideo(media, 10, 8, transitionMargin);
	} else if (info.manufacturer !== undefined) {
		udmd.DisplayScene00("FlexDMD.Resources.dmds.black.png", info.manufacturer, 15, "", 15, 10, 3000, 8);
	}
	*/
	
	

// Manufacturer
    let transitionMargin = (20 * 1000) / 60;
    //little workaround for special character in Williams "TM" Pinball Problem from FX3
    let manufacturer_temp = info.manufacturer;
    
    // If its Williams and it has mor than 8 chars
    if ((manufacturer_temp.substr(0,8) == "Williams") && (manufacturer_temp.length > 8)){
        manufacturer_temp = "WilliamsFX3Pinball";
    }
    if (manufacturer_temp in manufacturers) {
        var medias = manufacturers[manufacturer_temp];
        var media = medias[Math.floor(Math.random() * medias.length)];
        queueVideo(media, 10, 8, transitionMargin);
    } else if (info.manufacturer !== undefined) {
        udmd.DisplayScene00("FlexDMD.Resources.dmds.black.png", info.manufacturer, 15, "", 15, 10, 3000, 8);
    }


	
	
	// Stats
	if (info.rating >= 0)
		udmd.DisplayScene00("FlexDMD.Resources.dmds.black.png", "Played " + info.playCount + " Rating " + info.rating, 15, "Play time: " + info.playTime.toHHMMSS(), 15, 10, 3000, 8);
	else
		udmd.DisplayScene00("FlexDMD.Resources.dmds.black.png", "Played " + info.playCount + " times", 15, "Playtime " + info.playTime.toHHMMSS(), 15, 10, 3000, 8);

	// Insert Coin (every 4 loops)
	if (((loopCount + 0) & 3) == 0) {
		queueVideo("./Scripts/dmds/misc/insertcoin.gif", 10, 14, 0);
		udmd.DisplayScene00("./Scripts/dmds/misc/insertcoin.gif", "", 15, "", 15, 10, 1399, 14);
		udmd.DisplayScene00("./Scripts/dmds/misc/insertcoin.gif", "", 15, "", 15, 14, 1399, 14);
	}

	// Global stats (every 4 loops)
	if (((loopCount + 1) & 3) == 0) {
		var totalCount = 0;
		var totalTime = 0;
		var nGames = gameList.getGameCount();
		for (var i = 0; i < nGames; i++) {
			var inf = gameList.getGame(i);
			totalCount += inf.playCount;
			totalTime += inf.playTime;
		}
		udmd.DisplayScene00("FlexDMD.Resources.dmds.black.png", "Total play count:" , 15, "" + totalCount, 15, 10, 1500, 8);
		udmd.DisplayScene00("FlexDMD.Resources.dmds.black.png", "Total play time:" , 15, "" + totalTime.toDDHHMMSS(), 15, 10, 1500, 8);
	}
	
	// Drink'n drive (every 4 loops)
	if (((loopCount + 2) & 3) == 0) {
		udmd.DisplayScene00("./Scripts/dmds/misc/drink'n drive.png", "", 15, "", 15, 10, 3000, 8);
	}
	
	// Highscores
	if (hiscores[info.id] != null) {
		udmd.ScrollingCredits("", hiscores[info.id].join("|"), 15, 14, 2800 + hiscores[info.id].length * 400, 14);
	}
	
	dmd.UnlockRenderThread();
	logfile.log("< Update DMD done");

	// Add a timeout for when the queue will be finished
	updater = setTimeout(UpdateDMD, 10000);
}

gameList.on("gameselect", event => {
	logfile.log("> gameselect");
	info = event.game;
	UpdateDMD();
});

gameList.on("highscoresready", event => {
	logfile.log("> highscoresready");
	if (event.success && event.game != null) {
		logfile.log("> scores received");
		for (var i = 0; i < event.scores.length; i++) {
			event.scores[i] = event.scores[i].replace(/\u00FF/g, ',');
		}
		hiscores[event.game.id] = event.scores;
		if (shownInfo != null && event.game.id == shownInfo.id) {
			udmd.ScrollingCredits("", hiscores[shownInfo.id].join("|"), 15, 14, 2800 + hiscores[shownInfo.id].length * 400, 14);
		}
	}
});

mainWindow.on("prelaunch", event => {
	logfile.log("> launch");
	if (dmd != null) {
		udmd.CancelRendering();
		dmd.Run = false;
	}
});

mainWindow.on("postlaunch", event => {
	logfile.log("> postlaunch");
	if (dmd != null) dmd.Run = true;
	UpdateDMD();
});



//-----------------------------------------------------------------------------------------------//
// Show image overlay
mainWindow.on("launchoverlayshow", ev => {
    let animation = gameList.resolveMedia("Images", "launch-image.jpg");
    mainWindow.showWheel(false);
    mainWindow.setUnderlay("");
    mainWindow.launchOverlay.bg.loadImage(animation);
    ev.preventDefault();
});


//  hide the animated overlay Video as soon as the game has finished loading
mainWindow.on("gamestarted", ev => {
    mainWindow.launchOverlay.bg.clear(0xff404040);
    mainWindow.showWheel(true);
});




//-----------------------------------------------------------------------------------------------//
// Choose a random game from current selection

// in the main menu, add "Start random Game" after the
// Play command
let RandomGameCommand = command.allocate("RandomGameStart");
mainWindow.on("menuopen", ev => {
    if (ev.id == "main") {
        // main menu add item
        ev.addMenuItem({ after: command.PlayGame },
                { title: "Start Random Game", cmd: RandomGameCommand });
      
    }
});

mainWindow.on("command", ev => {
    // Random start gefunden
    if (ev.id == RandomGameCommand) {
      let games = gameList.getAllWheelGames();
      let game_count = games.length;
      let choosenGame = Math.floor(Math.random() * (game_count + 1));
      //start choosen game
        mainWindow.playGame(games[choosenGame]);
    }
});



//-----------------------------------------------------------------------------------------------//
// Add Hotseat Modes to below Play on menu

// in the main menu, add Hotseat Modes after the
// Play command
let setPlayHotseatModeCommand = command.allocate("PlayHotseatMode");
mainWindow.on("menuopen", ev => {
    if (ev.id == "main") {
        // main menu - check the current game's system
        let game = gameList.getWheelGame(0) || { };
        let sys = game.system || { };
        if (/pinball fx3\.exe$/i.test(sys.processName)) {
            // it's FX3 - add the Hotseat Play Mode command
            ev.addMenuItem({ after: command.PlayGame },
                { title: "Play Hotseat Mode", cmd: setPlayHotseatModeCommand });
        }
    }
});

// Show the mode selection menu when the Play Hotseat Mode command
// is used, and process the commands in that menu.
let Hotseat2ModeCommand = command.allocate("Hotseat2Mode");
let Hotseat3ModeCommand = command.allocate("Hotseat3Mode");
let Hotseat4ModeCommand = command.allocate("Hotseat4Mode");


mainWindow.on("command", ev => {
    if (ev.id == setPlayHotseatModeCommand) {
        let game = gameList.getWheelGame(0) || { };
        let sys = game.system || { };
        if (/pinball fx3\.exe$/i.test(sys.processName)) {
            mainWindow.showMenu("custom.hotseatmode.fx3", [
                {
                    title: "Hotseat: 2 Players",
                    cmd: Hotseat2ModeCommand,
                },
                {
                    title: "Hotseat: 3 Players",
                    cmd: Hotseat3ModeCommand,
                },
                 {
                    title: "Hotseat: 4 Players",
                    cmd: Hotseat4ModeCommand,
                },
               { cmd: -1 },  // separator
                { title: "Cancel", cmd: command.MenuReturn }
            ]);

            // tell the system not to launch the game yet
            ev.preventDefault();
        }
    }

    else if (ev.id == command.Hotseat2Mode) {
        let game = gameList.getWheelGame(0) || { };
        let sys = game.system || { };
        if (/pinball fx3\.exe$/i.test(sys.processName)) {
            // figure out the hotseatmode options based on the current mode
            // launch it with the hotseatmode 2 Players
			mainWindow.playGame(game, {
				overrides: {
					params: "-applaunch 442120 -hotseat_2 -table_[TABLEFILEBASE]"
				}
			});
            // skip the default action, since we did the launch here instead
            ev.preventDefault();
        }
    }

    else if (ev.id == command.Hotseat3Mode) {
        let game = gameList.getWheelGame(0) || { };
        let sys = game.system || { };
        if (/pinball fx3\.exe$/i.test(sys.processName)) {
            // figure out the hotseatmode options based on the current mode
            // launch it with the hotseatmode 3 Players
			mainWindow.playGame(game, {
				overrides: {
					params: "-applaunch 442120 -hotseat_3 -table_[TABLEFILEBASE]"
				}
			});
            // skip the default action, since we did the launch here instead
            ev.preventDefault();
        }
    }
	
    else if (ev.id == command.Hotseat4Mode) {
        let game = gameList.getWheelGame(0) || { };
        let sys = game.system || { };
        if (/pinball fx3\.exe$/i.test(sys.processName)) {
            // figure out the hotseatmode options based on the current mode
            // launch it with the hotseatmode 4 Players
			mainWindow.playGame(game, {
				overrides: {
					params: "-applaunch 442120 -hotseat_4 -table_[TABLEFILEBASE]"
				}
			});
            // skip the default action, since we did the launch here instead
            ev.preventDefault();
        }
    }	
	
});


// -------------------------------------------------------------------------------

// Global variable for keeping track of the current FX3 play
// mode.  We'll use the strings "classic" and "new" to represent
// the modes.  Initially, we'll restore the saved value from the
// settings file.
let currentFX3ModeKey = "custom.fx3.playMode";
let currentFX3Mode = optionSettings.get(currentFX3ModeKey, "classic");

// in the main menu, add our new Set Play Mode command after the
// Play command
let setPlayModeCommand = command.allocate("SetPlayMode");
mainWindow.on("menuopen", ev => {
    if (ev.id == "main") {
        // main menu - check the current game's system
        let game = gameList.getWheelGame(0) || { };
        let sys = game.system || { };
        if (/pinball fx3\.exe$/i.test(sys.processName)) {
            // it's FX3 - add the Set Play Mode command
            ev.addMenuItem({ after: command.PlayHotseatMode },
                { title: "Set Play Mode", cmd: setPlayModeCommand });
        }
    }
});

//-----------------------------------------------------------------------------------------------//
// Show the mode selection menu when the Set Play Mode command
// is used, and process the commands in that menu.
let classicPhysicsModeCommand = command.allocate("ClassicPhysicsMode");
let newPhysicsModeCommand = command.allocate("NewPhysicsMode");
mainWindow.on("command", ev => {
    if (ev.id == setPlayModeCommand) {
        let game = gameList.getWheelGame(0) || { };
        let sys = game.system || { };
        if (/pinball fx3\.exe$/i.test(sys.processName)) {
            mainWindow.showMenu("custom.playmode.fx3", [
                {
                    title: "Classic Physics Mode",
                    cmd: classicPhysicsModeCommand,
                    radio: currentFX3Mode == "classic"
                },
                {
                    title: "New Physics Mode",
                    cmd: newPhysicsModeCommand,
                    radio: currentFX3Mode == "new"
                },
                { cmd: -1 },  // separator
                { title: "Cancel", cmd: command.MenuReturn }
            ]);

            // tell the system not to launch the game yet
            ev.preventDefault();
        }
    }
    else if (ev.id == classicPhysicsModeCommand) {
        // set the new mode and save to the settings
        optionSettings.set(currentFX3ModeKey, currentFX3Mode = "classic");
    }
    else if (ev.id == newPhysicsModeCommand) {
        // set the new mode and save to the settings
        optionSettings.set(currentFX3ModeKey, currentFX3Mode = "new");
    }
    else if (ev.id == command.PlayGame) {
        let game = gameList.getWheelGame(0) || { };
        let sys = game.system || { };
        if (/pinball fx3\.exe$/i.test(sys.processName)) {
            // figure out the extra options based on the current mode
            let extra = "";
            if (currentFX3Mode == "classic")
                extra = "-class ";
            else if (currentFX3Mode == "new")
                extra = "";

            // launch it with the extra options
            mainWindow.playGame(game, {
                overrides: { params: extra + sys.params }
            });

            // skip the default action, since we did the launch here instead
            ev.preventDefault();
        }
    }
});


//-----------------------------------------------------------------------------------------------//
//Flex DMD Integration in PinballY

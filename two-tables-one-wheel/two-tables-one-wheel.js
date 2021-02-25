/* Alternate Versions of Tables under one Wheel item
 * 
 * Loosely based on "Custom Play Modes" from mjr at
 * http://mjrnet.org/pinscape/downloads/PinballY/Help/CustomPlayModesExample.html
 *
 * There are a few tables that have multiple versions and I did not want to
 * install only one, but I also did not want multiple wheel items, all with
 * the same picture. I really wanted something similar to a Pinup Popper 
 * example where one wheel item launches alternate versions of a table. In their
 * example the table is copied into place (yuck). MJR's example for "Custom
 * Play Modes" was close, but really onyl allowed sending different parameters
 * to the same table. I wanted to launch an entirely different table.
 */

// On run load the last state of the alternate versions filter
let alternateVersionFilterKey = "custom.AlternateVersionFilterMode";
let alternateVersionFilterOn = optionSettings.getBool(alternateVersionFilterKey);
let alternateVersionFilterId; // Id of metafilter to show/hide alternate versions
let alternateVersionFilterCommand = command.allocate("AlternateVersionFilterToggle");
var alternateVersions = []; //  Holds current wheel items alternate versions
var alternateVersionCommands = [];   // Holds allocated launch commands

if (alternateVersionFilterOn) {
    // if the saved setting is On, enable the filter immediately
    enableAlternateVersionFilter();
}

// is the given game an alternate version?
// Does it have the alternate version category assigned to it.
function isAlternateVersion(game) {
    return game.categories.indexOf("isAlternateVersion") >= 0;
}

// is the giveo version an alternate for the give game?
function isAlternateVersionForGame(alternate, game) {
    // Check for title match and isAlternateVersion category
    return alternate.title.startsWith(game.title) && isAlternateVersion(alternate);
}

function enableAlternateVersionFilter() {
    // NOTE: Creating a filter immediately puts it into effect
    alternateVersionFilterId = gameList.createMetaFilter({
        priority: 1000,
        select: function(game, include) {
            return !isAlternateVersion(game);
        }
    });
}

function disableAlternateVersionFilter() {
    // NOTE: Removing a filter immediately puts it into effect
    gameList.removeMetaFilter(alternateVersionFilterId);
}

function allocateCommandIdsForAlternateVersions() {
    let neededCommands = alternateVersions.length;
    let currentCommands = alternateVersionCommands.length;
    for (var i = currentCommands; i < neededCommands; i++) {
        alternateVersionCommands[i] = command.allocate('AlternateVersionLaunch' + i);
    }
}

// Update global alternate versions for currently selected game
function updateAlternateVersions() {
    let selectedGame = gameList.getWheelGame(0) || { };
    if (selectedGame) {
        let allGames = gameList.getAllGames();
        alternateVersions = allGames.filter(
            (game) => isAlternateVersionForGame(game, selectedGame));
    }
}

// Extract the version name from the last parens
// With title 'Medieval Madness (Knorr)' will produce 'Knorr'
function getAlternateVersionName(game) {
    let matches = game.title.match(/^.*\((.*?)\)$/);
    if (matches) { 
        return matches[matches.length - 1];
    } else {
        return game.system.displayName;
    }
}

// Returns the Pinball Y command id for the selected alternate version
function getCommandIdForAlternateVersion(versionIndex) {
    return alternateVersionCommands[versionIndex];
}

// Get the index into alternateVersions array of the game for a given
// command id. This compliments getCommandIdForAlternateVersion()
function getAlternateVersionForCommandId(commandId) {
    return alternateVersionCommands.findIndex(id => id == commandId);
}

// Helper to determine if the command id is in the range used for the
// current set of alternate versions.
function isAlternateVersionCommandId(commandId) {
    return getAlternateVersionForCommandId(commandId) >= 0;
}

function makeAlternateVersionsMenuItems() {
    let menuItems = alternateVersions.map(function(game, index) {
            return {
                title: 'Play ' + getAlternateVersionName(game) + ' Version',
                cmd: getCommandIdForAlternateVersion(index)
            };
        });

    return menuItems;
}

// Intercept menu creation to add our items.
mainWindow.on("menuopen", ev => {
    if (ev.id == "main") {
        // Add any alternate versions to main Play menu
        updateAlternateVersions();
        allocateCommandIdsForAlternateVersions();
        let menuItems = makeAlternateVersionsMenuItems();
        ev.addMenuItem({ 'after': command.PlayGame }, menuItems);
    } else if (ev.id == "operator") {
        // Add show alternate versions to Operator Menu
        let showHiddenCommand = gameList.getFilterInfo("Hidden").cmd;
        ev.addMenuItem(showHiddenCommand, {
            title: "Show Alternate Versions",
            cmd: alternateVersionFilterCommand,
            checked: !alternateVersionFilterOn
        });
    }
});

// Intercept command execution to handle our menu items.
mainWindow.on("command", ev => {
    if (isAlternateVersionCommandId(ev.id)) {
        // Launch our alternate version of a table...
        let alternateVersionIndex = getAlternateVersionForCommandId(ev.id);
        let game = alternateVersions[alternateVersionIndex];
		mainWindow.playGame(game);
		ev.preventDefault();
    } else if (ev.id == alternateVersionFilterCommand) {
        // Toggle the alternate version metafilter...
        alternateVersionFilterOn = !alternateVersionFilterOn;
        optionSettings.set(alternateVersionFilterKey, alternateVersionFilterOn);
        if (alternateVersionFilterOn) {
            enableAlternateVersionFilter();
        } else {
            disableAlternateVersionFilter();
        }
    } 
});

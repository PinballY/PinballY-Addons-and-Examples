// Category Multi-Tag Command - an add-in for PinballY
// Copyright 2021 Michael J Roberts - MIT License
//
// This adds a new "Batch Category Tagging" command to the main
// Operator menu.  Selecting the command brings up a list of all
// of the current categories.  Selecting a category takes you to
// a list of all of the games; simply scroll through the list of
// games, and check or un-check each item to add or remove the
// selected category.  Select Save when done to apply the
// changes.


// Allocate commands for initiating the multi-tag command, and for
// the "Save" command
let multiTagCmd = command.allocate("MultiTag");
let multiTagSaveCmd = command.allocate("MultiTagSave");

// Insert the multi-tag command into the Operator menu
mainWindow.on("menuopen", ev => {
    if (ev.id == "operator") {
        ev.addMenuItem(
            { after: command.BatchCaptureStep1 },
            { title: "Batch Category Tagging", cmd: multiTagCmd });
    }
});

// Set up command mappings for categories and games.  In each
// case we need to map both ways - from a command to a category
// and vice versa, and from a command to a game and vice versa.
// So we need two mapping tables for each case.
let categoryToCommand = new Map();
let commandToCategory = new Map();
let gameToCommand = new Map();
let commandToGame = new Map();

// Keep a map of games (by ID) that have been checkmarked or
// un-checkmarked the course of the current menu session.  If
// a game appears here, the status here has been explicitly
// set by the user by selecting the game in the menu.  If not,
// we'll use the current status in the GameInfo record.
let temporaryGameSelections;

// Current category selection.  This is the category that
// we're applying to games in the game list menu.
let currentCategory;

// Determine if a game should be shown as checked in the menu.
// If the user has explicitly checked or un-checked the game,
// it'll appear in the temporary selection list with its
// current status, so we'll return that status.  If it's not
// there, it means that the user hasn't changed the status
// for this game yet, so we simply use its current GameInfo
// status.
function isGameChecked(game)
{
    // look it up in the temporary selection map
    let checked = temporaryGameSelections.get(game.id);

    // if it's there, use the temporary selection status
    if (checked !== undefined)
        return checked;

    // it's not there, so use the category list from its
    // GameInfo - it's checked if it already has the
    // category assigned there
    return game.categories.indexOf(currentCategory) >= 0;
}

// Show the game selection menu for the current category
// multi-tag command.  We need to be able to do this repeatedly
// throughout the session, because we have to re-display the
// whole menu each time the user selects one of the commands.
function showGameMenu(startOnGame)
{
    let menu = [
        { title: "Now select all games that you'd like to tag with category \"" + currentCategory + "\".", cmd: -1 },
        { cmd: -1 },
        { cmd: command.MenuPageUp },
    ];
    for (let game of gameList.getAllGames()) {
        // look up or assign a unique command ID to the game
        let cmd = gameToCommand.get(game.id);
        if (!cmd) {
            gameToCommand.set(game.id, cmd = command.allocate("Game" + game.id));
            commandToGame.set(cmd, game);
        }

        // add the menu item
        menu.push({
            title: game.title,
            cmd: cmd,
            checked: isGameChecked(game),
            stayOpen: true,
            selected: startOnGame && startOnGame.id == game.id});
    }
    menu.push({ cmd: command.MenuPageDown });
    menu.push({ cmd: -1 });
    menu.push({ title: "Save", cmd: multiTagSaveCmd });
    menu.push({ title: "Cancel", cmd: command.MenuReturn });
    mainWindow.showMenu(
        "custom.multiTagGames", menu,
        { dialogStyle: true, noAnimation: !!startOnGame, pageNo: startOnGame ? "same" : 0 });
}

// Handle the multi-tag commands
mainWindow.on("command", ev => {
    let cat, game, cmd;
    if (ev.id == multiTagCmd) {
        // Initial Multi-Tag command: bring up a menu showing a list
        // of categories to choose from.
        let menu = [
            { title: "This command lets you assign a category to a batch of games all at once. "
               + " First, select the category to assign.", cmd: -1 },
            { cmd: -1 },
            { cmd: command.MenuPageUp },
        ];
        for (cat of gameList.getAllCategories()) {
            if (!(cmd = categoryToCommand.get(cat))) {
                categoryToCommand.set(cat, cmd = command.allocate("Category" + cat));
                commandToCategory.set(cmd, cat);
            }
            menu.push({ title: cat, cmd: cmd });
        }
        menu.push({ cmd: command.MenuPageDown });
        menu.push({ cmd: -1 });
        menu.push({ title: "Cancel", cmd: command.MenuReturn });
        mainWindow.showMenu("custom.multiTagCategories", menu, { dialogStyle: true });
    }
    else if ((cat = commandToCategory.get(ev.id)) !== undefined) {
        // Category command - this means that the user selected one
        // of the categories from the initial category menu.  Remember
        // the category selection, create a new, empty map for the
        // temporary selection status, and show the game list menu.
        currentCategory = cat;
        temporaryGameSelections = new Map();
        showGameMenu();
    }
    else if ((game = commandToGame.get(ev.id)) !== undefined) {
        // Game command - this means that the user selected one of the
        // games in the game list menu.  Reverse the selection status
        // for this game and re-show the menu.
        temporaryGameSelections.set(game.id, !isGameChecked(game));
        showGameMenu(game);
    }
    else if (ev.id == multiTagSaveCmd) {
        // Save command - the user wants to save the current selection.
        // For each game, check to see if the status was set in the
        // temporary selection list, and if so, if the new status is
        // different from the old status.  The "old status" is simply
        // whether or not the game had the category assigned.  If the
        // status changed, add or remove the category for the game.
        for (game of gameList.getAllGames()) {
            let checked = temporaryGameSelections.get(game.id);
            if (checked !== undefined) {
                let cats = game.categories;
                let idx = cats.indexOf(currentCategory);
                let hasCat = (idx >= 0);
                if (checked != hasCat) {
                    if (hasCat)
                        cats.splice(idx, 1);
                    else
                        cats.push(currentCategory);
                    game.update({ categories: cats });
                }
            }
        }
    }
});


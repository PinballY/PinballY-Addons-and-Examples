//metafilter 
// These special filters "narrow" existing filters
// e.g. You filter "Visual Pinball X" as system
// regular "3 stars" Filter added afterwards would bring again all 3stars games (incl. FX3, FP, ...)
// using this Meta Filter instead keeps the "only Visual PinballX" list and additionaly removes everything below 3 stars.


// global variable to save FilterID --> needed to remove filters later
var meta_3star_id; 
var meta_4star_id; 
var meta_notrated_id;


let RemoveMetaFilter = command.allocate("removeMeta"); // Remove all metaflters 
let MetaFilterSub  = command.allocate("MetaFilterSub");   // This is the "entrance" into the submenu

//lets define the menu and functions

mainWindow.on("menuopen", ev => { // when main menu is triggered
    if (ev.id == "main") { 
        ev.addMenuItem({after: command.RateGame}, // add item after "Rate Game"
            { title: "Remove Metafilter", cmd: RemoveMetaFilter }); 
		ev.addMenuItem({ after: command.PlayGame },    // this is the trigger for the SUB menu, right after "play game" on the very top 
                { title: "Set MetaFilter", cmd: MetaFilterSub });	
    }
});



// Lets "define" the functions of the sub menu
// 4 colors will be provided
let Meta_sub_unrated   = command.allocate("unrated");
let Meta_sub_4starplus  = command.allocate("4star"); 
let Meta_sub_3starplus  = command.allocate("3star");

// if Submenu was triggered
mainWindow.on("command", ev => {
    if (ev.id == MetaFilterSub) {
				mainWindow.showMenu("custom.ShowMetaFilter", 
				            [
								{   //unrated
									title: "Only unrated tables",
									cmd: Meta_sub_unrated,
								},
								{  //3starplus
									title: ">=3 stars",
									cmd: Meta_sub_3starplus,
								},
								{  //4starplus
									title: ">=4 stars",
									cmd: Meta_sub_4starplus,
								},
								{  // separator line
								    cmd: -1 
								},
								{  //4starplus
									title: "Remove MetaFilter",
									cmd: RemoveMetaFilter,
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
	

    //if any of our commands have been recognized --> do something
	if (ev.id ==  RemoveMetaFilter ) {
	 gameList.removeMetaFilter(meta_3star_id);
	 gameList.removeMetaFilter(meta_4star_id);
	 gameList.removeMetaFilter(meta_notrated_id);
	}	
	if (ev.id ==  Meta_sub_unrated ) {
		meta_notrated_id = gameList.createMetaFilter({
			includeExcluded: false,   // consider all games, even if excluded by other filters
			priority: 100000,        // high priority so that get the last say
			select: function(game, included) {
				// keep it if it's included by the other filters, OR if
				// it has the "Core" category tag
				return game.rating == -1;
			}
		});
    }
	if (ev.id == Meta_sub_3starplus) {
		
		meta_4star_id = gameList.createMetaFilter({
			includeExcluded: false,   // consider all games, even if excluded by other filters
			priority: 100000,        // high priority so that get the last say
			select: function(game, included) {
				return game.rating >= 3;
			}
		});
	}
	if (ev.id == Meta_sub_4starplus) {
		
		meta_4star_id = gameList.createMetaFilter({
			includeExcluded: false,   // consider all games, even if excluded by other filters
			priority: 100000,        // high priority so that get the last say
			select: function(game, included) {
				return game.rating >= 4;
			}
		});
	}
    
});


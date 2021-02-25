//metafilter 
// These special filters "narrow" existing filters
// e.g. You filter "Visual Pinball X" as system
// You can choose EM, SS, EM tables. 
//As it is a meta filter you can first select regular 4 star filter and than narrow down only to EM tables
// you have to remove metafiler, else you will get 0 result.
// e.g. selection SS tables and than selecting EM tables will bring up 0 tables.
// there is no table which is SS AND EM


// global variable to save FilterID --> needed to remove filters later
var meta_SStables_id; 
var meta_EMtables_id; 
var meta_MEtables_id;


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



let Meta_sub_ME   = command.allocate("MEtables");
let Meta_sub_EM  = command.allocate("EMtables"); 
let Meta_sub_SS  = command.allocate("SStables");

// if Submenu was triggered
mainWindow.on("command", ev => {
    if (ev.id == MetaFilterSub) {
				mainWindow.showMenu("custom.ShowMetaFilter", 
				            [
								{   //SS tables
									title: "Pure Mechanical",
									cmd: Meta_sub_ME,
								},
								{  //EM tables
									title: "Solid State Tables",
									cmd: Meta_sub_SS,
								},
								{  //4starplus
									title: "Electromechanical Tables",
									cmd: Meta_sub_EM,
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
	 gameList.removeMetaFilter(meta_SStables_id);
	 gameList.removeMetaFilter(meta_EMtables_id);
	 gameList.removeMetaFilter(meta_MEtables_id);
	}	
	if (ev.id ==  Meta_sub_ME ) {
		meta_MEtables_id = gameList.createMetaFilter({
			includeExcluded: false,   // consider all games, even if excluded by other filters
			priority: 100000,        // high priority so that get the last say
			select: function(game, included) {
				// keep it if it's included by the other filters, OR if
				// it has the "Core" category tag
				return game.tableType == 'ME';
			}
		});
    }
	if (ev.id == Meta_sub_SS) {
		
		meta_EMtables_id = gameList.createMetaFilter({
			includeExcluded: false,   // consider all games, even if excluded by other filters
			priority: 100000,        // high priority so that get the last say
			select: function(game, included) {
				return game.tableType == 'SS';
			}
		});
	}
	if (ev.id == Meta_sub_EM) {
		
		meta_EMtables_id = gameList.createMetaFilter({
			includeExcluded: false,   // consider all games, even if excluded by other filters
			priority: 100000,        // high priority so that get the last say
			select: function(game, included) {
				return game.tableType == 'EM';
			}
		});
	}
    
});


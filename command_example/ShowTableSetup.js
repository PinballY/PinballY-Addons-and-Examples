//################################################################add Table setup to regular menu###############################################
/* This is a very simple example script how you can add many things to you menu*/



let Show_table_setup = command.allocate("showTableSetup"); // A function in main menu 

//lets define the menu and functions
mainWindow.on("menuopen", ev => { // when main menu is triggered
    if (ev.id == "main") { 
        ev.addMenuItem({ after: command.PlayGame },  // where should the new item be placed in menu?   
                { title: "Table setup", cmd: Show_table_setup });  // name of the new menu item	 
    }
});


mainWindow.on("command", ev => {
	if (ev.id == Show_table_setup) {  // if its triggered
		mainWindow.doCommand(command.ShowGameSetupMenu); // HERE comes the final predefined command
    }
});

mainWindow.on("keydown", ev => {
    if (ev.code == "ArrowUp") {
        //mainWindow.doCommand(command.Flyer);
		   instCardWindow.showWindow(false); // hat ohne diese Zeile teilweise erst beim 4-5 drücken funktioniert
			instCardWindow.createDrawingLayer(10000);
			instCardWindow.showWindow(true); 
        ev.preventDefault();
    }
});
mainWindow.on("keydown", ev => {
    if (ev.code == "ArrowDown") {
        //mainWindow.doCommand(command.Flyer);
		   instCardWindow.showWindow(false); // hat ohne diese Zeile teilweise erst beim 4-5 drücken funktioniert
        ev.preventDefault();
    }
});
mainWindow.on("keydown", ev => {
    if (ev.code == "ArrowLeft") {
        mainWindow.doCommand(command.Flyer);
        ev.preventDefault();
    }
});
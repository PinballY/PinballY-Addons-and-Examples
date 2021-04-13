mainWindow.on("menuopen", ev => {
    if (ev.id == "exit")
        ev.addMenuItem(command.PowerOff, { title: "SleepComputer", cmd: command.UserSleepCMD });
});
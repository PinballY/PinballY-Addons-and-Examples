mainWindow.on("command", ev => {
    if (command.name(ev.id) == "UserSleepCMD") {
		let PowrProf = dllImport.bind("PowrProf.dll", `
        BOOL WINAPI SetSuspendState(BOOL bHibernate, BOOL bForce, BOOL bWakeupEventsDisabled);
         `);
        if (optionSettings.isDirty())
           optionSettings.save();
        // set sleep mode [use this to replace the "log off Windows" section in the example]
        PowrProf.SetSuspendState(0, 0, 0);
	}
});

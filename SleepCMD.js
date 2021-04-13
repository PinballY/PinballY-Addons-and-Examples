// To log off, we just need to call ExitWindowsEx(0, 0) in the Windows API.
// Bind the DLL function so that we can call it from Javascript when the
// time arrives.
//let User32 = dllImport.bind("User32.dll", `
//    BOOL WINAPI ExitWindowsEx(UINT uFlags, DWORD dwReason);
//`);
// bind the system sleep API [use this to replace the User32 binding in the example]
HandleHolder hToken;
let PowrProf = dllImport.bind("PowrProf.dll", `BOOL WINAPI SetSuspendState(BOOL bHibernate, BOOL bForce, BOOL bWakeupEventsDisabled);`);

BOOL ok = OpenThreadToken(GetCurrentThread(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, TRUE, &hToken);
DWORD err;
if (!ok)
{
	err = GetLastError();
	if (err == ERROR_NO_TOKEN && ImpersonateSelf(SecurityImpersonation))
	{
		ok = OpenThreadToken(GetCurrentThread(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, TRUE, &hToken);
		if (!ok)
			err = GetLastError();
	}
}

if (!ok)
{
	WindowsErrorMessage winErr(err);
	ShowError(EIT_Error, MsgFmt(IDS_ERR_SHUTDN_TOKEN, err, winErr.Get()));
	return;
}

// get the local ID for SeShutdownName
LUID luid;
if (!LookupPrivilegeValue(NULL, SE_SHUTDOWN_NAME, &luid))
{
	WindowsErrorMessage winErr;
	ShowError(EIT_Error, MsgFmt(IDS_ERR_SHUTDN_PRIVLK, (long)winErr.GetCode(), winErr.Get()));
	return;
}

// enable the privilege
TOKEN_PRIVILEGES tp;
tp.PrivilegeCount = 1;
tp.Privileges[0].Luid = luid;
tp.Privileges[0].Attributes = SE_PRIVILEGE_ENABLED;
if (!AdjustTokenPrivileges(hToken, FALSE, &tp, sizeof(tp), NULL, NULL))
{
	WindowsErrorMessage winErr;
	ShowError(EIT_Error, MsgFmt(IDS_ERR_SHUTDN_PRIVADJ, (long)winErr.GetCode(), winErr.Get()));
	return;
}

// Take over the Power Off Confirm command
mainWindow.on("command", ev => {
    if (ev.id == command.PowerOffConfirm) {
        // save any settings changes
        if (optionSettings.isDirty())
            optionSettings.save();

        // log off Windows
        //const EWX_LOGOFF = 0;
        //const SHTDN_REASON_FLAG_PLANNED = 0x80000000;
        //User32.ExitWindowsEx(EWX_LOGOFF, SHTDN_REASON_FLAG_PLANNED);
        // set sleep mode [use this to replace the "log off Windows" section in the example]
        SetSuspendState(0, 0, 0);

        // quit out of PinballY
        //mainWindow.doCommand(command.Quit);

        // skip the normal Power Off command processing
        //ev.preventDefault();
    }
});



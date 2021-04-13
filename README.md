PinballY Sleep Command

This addon to Pinbally adds a "sleep computer" command to the PinballY system menu.
The reason I created this script is because my rig recovers faster from a sleep command than a complete reboot.

The only caveat to this script is that according to Microsoft documentation, The calling process must have the SE_SHUTDOWN_NAME privilege.
This is an admin function and PinballY usually runs in non-admin state.  However, this works on my rig without having to run PinballY as admin.

At the time of this writting, my system was completely up to date with all patches and security updates.  So if this script doesn't work for you, you may have to flip PinballY to admin by using the AdjustTokenPrivileges function.

INSTALLATION:
Add the three scripts to the PINBALLY/scripts directory.
Update the main.js script to add the following:
==============
import "AddUserSleepCMD.js";
import "UserSleepCMD.js";
command.allocate("UserSleepCMD");		
==============

Restart PinballY.

Enjoy!
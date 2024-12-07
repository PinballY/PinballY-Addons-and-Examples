PinMAME functions for PinballY by Tengri
========================================

Allows to control ROM volume & DMD of PinMAME conveniently from PinballY
- Showpindmd (0 / 1) shows or hides the DMD controlled by PinMAME. Disabling the DMD is useful for older ROM based tables with alphanumeric displays, where PinMAME is showing basic numbers only on the DMD.
- Volume (0 to -32) attenuates the volume of the ROM sound from PinMAME. This allows to balance out the volume coming from the backbox speakers vs. the volume of the playfield sound. This is for older ROM based tables, which do not have a DMD menu with volume control. 0 is the loudest (default). I have never needed values below -16. So this is the range being shown in the menu. It is usually sufficient to go in steps of 2, as I have never needed the steps to be finer.
- The only change that needs to be done to the script is the scriptpath itself. It defaults to "C:\\PinballY\\Scripts\\" which should work out of the box for most installations.

The registry key for the ROM is retrieved from PinballYs metadata. In my experience, this works quite well for 95% of the tables that I have used it for so far.

The changes to the Windows registry are being done by a small helper application, built with AutoIt3. You can use the provided EXE or build it yourself from source.

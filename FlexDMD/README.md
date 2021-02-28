# FLEXdmd


#!! YOU NEED TO INSTALL FLEXDMD https://github.com/vbousquet/flexdmd#installation !!
- This script was found at https://github.com/vbousquet/flexdmd
- Manufactureranufacturer images / anmimations created by fr33styler (https://www.dietle.de/projekt-vpin-virtueller-flipper/)


This script shows a manufacturer animated gif and some stats like highscore, total playtime, ... on your DMD screen.

![example video](https://github.com/PinballY/PinballY-Addons-and-Examples/blob/main/FlexDMD/example.mp4)

## Installation ##
1. As usual copy the **FlexDMD.js** into your *PinballY/Scripts/* folder
2. Add ```import "FlexDMD.js";``` to your **main.js**
3. copy the dmd folder into your scripts folder
4. restart PinballY



**Version 1.0**
Initially created

**Known Issues:**
- Sometimes after finishing a table it does not restart. Now idea why.
- DMD position is sometimes "off" a few pixel.
   in the FLEXdmd.js file search for "comment this" and comment this line. Uncomment the next line  
   go to DmdDevice.ini  and add:
   adjust the values to your position of DMD
	[PinballY]
	virtualdmd left = 358
	virtualdmd top = -369
	virtualdmd width = 703
	virtualdmd height = 337   






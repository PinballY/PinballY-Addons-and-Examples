# start_random_table #

This script provides a "Start random table" function out of the standard game menu.
As there is (yet) no method to directly call a game on the GameWheel i had to improvise a little bit.

Result is a kind of "Wheel of furtune" effect. 
Jumping from letter to letter and finally from table to table.

You can define the maximum speed between the table changes. (depending on your solenoids, system performance)


### No animation - Option##
If you don't like the animated table change effect you can activate a direct table start - **BUT** PinballY will not load the corresponding backglass, dmd image or instruction card.
When you close the table - you will be back at the table where you triggered "Start Random Game".
 
![Start_random_game](https://github.com/worksasdesigned/PinballY_scrips/blob/Master/start_random_table/start_random_table.png)


## Installation ##
1. As usual copy the **start_random_table.js** into your *PinballY/Scripts/* folder
2. Add ```import "start_random_table.js";``` to your **main.js**
3. restart PinballY


**Version 1.0**
added Animated Table change (Wheel of furtune effect)

**Version 0.2**
Initially created

**OpenPoints:**
- clean up the code.... and structure it not like in the  late 90's....




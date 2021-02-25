# show_instruction_card

This is a very simple script which shows the instruction card WINDOW **while playing** a table.

![show_instruction_card](https://github.com/worksasdesigned/PinballY_scrips/blob/Master/show_instruction_card/show_instruction_card.png)
* *The shown instruction card comes from [www.pinballcards.com](http://www.pinballcards.com/)*

It must be activated in Wheel-mode before you start the table.

You can also setup a hotkey for the Instruction Card OVERLAY. (PinballY settings --> Buttons --> Instruction Card)
But this popup is hidden while playing a table.

The script is very rough... Sometimes the card was not shown or you needed to press the buttons several times.
So i have added a quick fix.
I guess every more or less skilled developer gets a heart attack when reading the simple code. Feel free to provide a better solution.
It works as designed. Good enough :-)

## Installation ##
1. As usual copy the **show_instruction_card.js** into your *PinballY/Scripts/* folder
2. Add ```import "show_instruction_card.js";``` to your **main.js**
3. open **show_instruction_card.js** and setup your hotkey for showing and hiding the card (e.g. F7 / F8) or any key from your CoinDoor
   Standard is "ArrowUp ⬆️" for showing and "ArrowDown ⬇️" for hiding.
4. open PinballY settings --> Systems --> VisualPinballX and mark the "Instruction Card" Checkbox green (click it twice).

![show_instruction_card2](https://github.com/worksasdesigned/PinballY_scrips/blob/Master/show_instruction_card/show_instruction_card2.png)
5. restart PinballY and test

hint: You can drag & drop and resize the Instruction Card Window as usual

hint2: This is **NOT** the Instruction Card Overlay which you can configure in PinballY Buttons setting
![show_instruction_card_standard](https://github.com/worksasdesigned/PinballY_scrips/blob/Master/show_instruction_card/show_instruction_card_standard.png)
  

**Version 0.2**
Initially created

**OpenPoints:**
- would be nice if a serious developer could have a look to avoid the annoying "hide and reopen" window. This can't be the best solution.





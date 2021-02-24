# PinballY Addons and Examples

Welcome!  This repository was created as a place to collect and share
extensions for [PinballY](http://mjrnet.org/pinscape/PinballY).
PinballY is a game launcher program for people who enjoy virtual
pinball on a PC, especially people who build dedicated "virtual pin
cabs" (a video game PC built into a real pinball machine body).

PinballY can be customized and extended via its built-in Javascript
engine, so we expect that most of the items in this repository will be
Javascript code.  PinballY's Javascript engine can also access native
code via DLLs, so native code extensions are also welcome here.

We expect that the collection here will be a mix of ready-to-use
add-ons that you can just drop into your PinballY environment to add
new features, and examples that you can use as starting points for
your own customizations.  Javascript is such an approachable language
that there needn't be a hard line between the two, though.  Anything
that's presented here as an add-on can also serve as starting point
for something more or something different that you have in mind.


## How to use Javascript in PinballY

To use one of the Javascript files you find here in PinballY:

* Download the script's .js file(s) and place them in the **Scripts** folder within your main PinballY program folder
* If you don't already have a file in your **Scripts** folder called **Main.js**, create one, using Notepad or any other plain-text editor you prefer
* Open **Main.js** (from the *Scripts* folder) in Notepad or your preferred editor, and add a line like this: `import "xxx.js"` (replacing **xxx** with the actual name of the script file)

If a particular add-on consists of multiple **.js** files, you might or
might not have to add an `import` command for each one - it depends on
how the add-on is designed.  Hopefully the code will include
instructions explaining what to do in this case.

For full details on using Javascript in PinballY, see the **Javascript**
section in the Help files that accompany the program.  You can
also view the [PinballY help online](http://mjrnet.org/pinscape/downloads/PinballY/Help/PinballY.html).


## Copyright and License

The items in this repository are copyrighted by their respective
authors.  Unless otherwise stated for a particular folder or script,
everything is released under [MIT
license](https://opensource.org/licenses/MIT).


## Collaborators welcome!

If you've created your own PinballY scripts that you'd like to include
here, get in touch and we'd be happy to add you as a contributor so
that you can check your code into a folder here.  We ask that code
contributions be provided under an open-source license so that users
can share and customize them; the default license unless you state
otherwise (by placing a notice in a script file, for example) is the
MIT License (see above).



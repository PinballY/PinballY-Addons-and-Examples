# PinballY Seamless Table Launch

This code replicates the [Seamless Loading Example](http://mjrnet.org/pinscape/downloads/PinballY/Help/SeamlessLoadingExample.html) provided in the [Worked Examples](http://mjrnet.org/pinscape/downloads/PinballY/Help/WorkedExamples.html) section of the [PinballY](http://mjrnet.org/pinscape/downloads/PinballY/Help/PinballY.html) documentation with the added feature of a loading activity "spinner" video that encircles the wheel image.

To use this example:

* Download `seamless-launch.js` and put it into your `PinballY\Scripts` directory

* Add the following to your `PinballY\Scripts\main.js` file

```
import 'seamless-launch.js'
```

* Move one of the Loading videos from the `Videos` directory here to your `PinballY\Media\Videos` directory and rename it to `Loading.xxx`, where `xxx` is the original file name extension.

NOTE: The example video files are in `MOV` format, but PinballY does not properly search for and locate files with the `.mov` extension when it searches for videos. Renaming them tricks PinballY into loading and showing it as normal, regardless that the format is different.

* Restart PinballY and enjoy.


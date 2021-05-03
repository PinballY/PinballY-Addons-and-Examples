// Missing Media Filter - PinballY add-in
// Copyright 2021 Michael J Roberts - MIT License
//
// This sets up a filter that selects games that have one
// or more missing media files, so that you can quickly see
// which games need attention for screen captures or media
// pack downloads.  You can customize the types of media
// included in the check - see the mediaTypes array defined
// below.  The filter can be selected via a command we add
// to the Operator menu, just after the "Show Unconfigured
// Games" command.


// List of media types to include in our search for missing
// media.  Add or remove items here as desired.  See the help
// under Javascript scripting > Media Types for a full list
// of the pre-defined media types.  You can also add any
// custom extended types you've created.
//
// Grouped items within [subarrays] are alternates, meaning
// that we consider the type to be populated if at least one
// of the items in the group is present.  If you want to make
// the check stricter so that some of these types have to be
// present individually, just remove them from the subarrays
// and place them in the main array instead.
//
// If you have a real DMD device (rather than using the
// simulated video DMD), you might wish to replace the
// DMD media types with the "real DMD" equivalents.
// Similarly, if you have a topper monitor and/or an
// instruction card monitor, you'll probably want to add
// the corresponding types for those.
let mediaTypes = [
    ["bg image", "bg video"],
    ["dmd image", "dmd video"],
    ["table image", "table video"],
    "wheel image",
];

// Create the filter
let missingMediaFilterCommand = gameList.createFilter({
    id: "MissingMedia",
    title: "Missing Media",
    select: game => {
        // test for missing media of a given type
        function isMissing(type) {
            if (Array.isArray(type)) {
                // It's a sub-array of alternative types, so consider the
                // media to be present if ANY ONE of the types is present.
                // This is the same as saying it's missing if ALL of the
                // types are missing.
                return type.every(subtype => isMissing(subtype));
            }
            else {
                // Single type - try resolving the media type to an
                // existing file.  This gives us an array of filenames,
                // so the media item is present if the array has any
                // elements (i.e., its length is non-zero).
                return game.resolveMedia(type, true).length == 0;
            }
        }

        // We'll include the game in the filter if it's missing media
        // files for ANY of the types in the mediaTypes list.  This is
        // the same as asking if it has media for ALL types in the
        // list: if not, it's missing something, so we include it in
        // the filter.  (This would be simpler if Javascript had an
        // Array.any() method, because then we'd return the more
        // straightforward "any(missing)".  But "any(missing)" is
        // equivalent to "not every(present)", which is the same as
        // "not every(not missing)".
        return !mediaTypes.every(type => !isMissing(type));
    }
});

// Add the Operator Menu command
mainWindow.on("menuopen", ev => {
    if (ev.id == "operator") {
        // Check if our filter is currently selected.  If it is, we'll
        // show it with a checkmark, and we'll put the "All Games" filter
        // into effect if the item is selected, since the user will
        // think of this as UN-checking the checked menu item.  If it's
        // not the current filter, then selecting the menu item will
        // make it the current filter.
        let active = gameList.getCurFilter().id == "User.MissingMedia";
        let cmd = active ? gameList.getFilterInfo("All").cmd : missingMediaFilterCommand;

        // insert the menu item
        ev.addMenuItem(
            { after: gameList.getFilterInfo("Unconfigured").cmd },
            { title: "Games w/Missing Media", cmd: cmd, checked: active });
    }
});

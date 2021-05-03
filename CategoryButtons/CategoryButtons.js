// Category Switcher Buttons - add-in for PinballY
// Copyright 2021 Michael J Roberts - MIT License
//
// This script sets up a pair of buttons (next/previous) to scroll
// through your category filters, so that you can select category
// filters without navigating through the menus.  Pressing the
// assigned Next button switches the active filter to the next
// category filter, and Previous switches to the previous category
// filter.  If the currently active filter isn't a category filter,
// pressing Next switches to the first category filter, and Prev
// switches to the last category filter.  When you scroll past
// the last/first filter, the All Games filter is selected.

mainWindow.on("keydown", ev => {
    if (ev.code == "ControlLeft") {
        switchCategories(-1);
        ev.preventDefault();
    }
    else if (ev.code == "ControlRight") {
        switchCategories(1);
        ev.preventDefault();
    }
});

function switchCategories(direction)
{
    // get the list of all categories, sorted alphabetically
    let cats = gameList.getAllCategories().sort(
        (a, b) => a.localeCompare(b, undefined, {sensitivity: "accent"}));

    // get the current filter, and check if it's a category filter
    let filter = gameList.getCurFilter();
    if (/^Category\.(.+)/.test(filter.id))
    {
        // it's a category filter - pull the category name from
        // the filter ID pattern
        let cat = RegExp.$1;

        // find it in the all-categories list
        let index = cats.indexOf(cat);
        if (index >= 0)
        {
            // found it - switch to the next/previous category
            index += direction;

            // at zero or end of list, switch to All Games;
            // otherwise switch to the new category
            if (index < 0 || index >= cats.length)
                gameList.setCurFilter("All");
            else
                gameList.setCurFilter("Category." + cats[index]);

            // success
            return;
        }
    }

    // We're not currently on a category filter, so switch to
    // the first category filter on Next or the last category
    // filter on Previous
    let cat = direction > 0 ? cats[0] : cats[cats.length - 1];
    if (cat)
        gameList.setCurFilter("Category." + cat);
}

# additional filters

![Show additional Filter](https://github.com/worksasdesigned/PinballY_scrips/blob/Master/additional_filters/additional_filters.png)

This enhancement adds 3 new filters to the existing "sort by rating" filter.
|Filter Name|Standard activated|description|
|-----------|------|-----------|
|**>=3 stars**| yes | selects all tables with 3-5 stars|
|**<3 stars**| yes |selects all tables with no rating - less than 3 stars|
|**Top10 Tables**| no |selects the first 10 tables with highest rating| 
|**Top10+ Tables**| no |selects the first 10 tables with highest rating in case of ties --> show more than 10 tables with same rating|
|**Top10 Tables sorted**|yes|selects the first 10 tables with highest rating. IF there are more than 10 tables - playtime will be the considered to make the selection.|

The original script and further details can be found in the official [PinballY documentation](http://mjrnet.org/pinscape/downloads/PinballY/Help/TopGamesExample.html).

Thanks to Michael Roberts!


## Installation
Copy the "*additional_filters.js*" into your **PinballY/Scripts/** folder and add
```import "additional_filters.js";``` to your *main.js*

You can activate/deactivate the filters inside the *additional_filters.js* by switching the corresponding variable to "true/false" at the top of the script. (or simply delete the entire code block).
Top10 filters can also simply be changed to a top 15 or top 20 list.


**Version 1.0**
Initially created



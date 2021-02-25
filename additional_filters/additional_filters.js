// script by Michael Roberts
// can be found here: http://mjrnet.org/pinscape/downloads/PinballY/Help/TopGamesExample.html


// ################################CUTOMIZING########################################################################
// SET filter variable to false to deaktive the filter

let filter1 = true;                   // ALL tables with >3 stars
let filter2 = true;                   // ALL tables with less than 3 stars
let filter3 = false;                  // Top 10 Games (just pick 10 best rated tables) - no further logic if there are 15 with same rating -> pick 10
	let filter3_number_of_games = 10; // How many games should be shown in "Top 10 Games" Filter?
let filter4 = false;                  // Same as "Top10 Games" but in case of "ties" the filter will show more than 10 Games.
	let filter4_number_of_games = 10; // How many games should be selected as basis
let filter5 = true;                   // Top10 filter (showing exactely 10 games). In case of more than 10 hits --> sort by playtime
	let filter5_number_of_games = 10; // How many games should be shown in "Top 10 Games" Filter?








//++++++++++++++++++++++++++++++++++++++++++++++++ >=3 stars +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Filter1: Show all tables with 3-5 stars rating
if (filter1){
	gameList.createFilter({
		id: "3StartsPlus",
		title: "3+ Stars",
		menuTitle: ">=3 Star Tables", // change the name of the Filter
		group: "[Rating]",
		sortKey: "3+",  // this sorts the new filter after "3-stars" in standard "rating menu"
		select: function(game) { return game.rating >= 3; }
	});
}



//++++++++++++++++++++++++++++++++++++++++++++++++ <3 stars ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Filter2: Show all Tables with no-rating to less than 3 stars
if (filter2){
	gameList.createFilter({
		id: "3StarsMinus",
		title: "3- Stars",  
		menuTitle: "< 3 Star Tables", // change the shown name of the filter
		group: "[Rating]",
		sortKey: "2-",  // this sorts the new filter after "2-stars"
		select: function(game) { return game.rating < 3; }
	});
}

//+++++++++++++++++++++++++++++++++++++++++++ Standard Top10 Tables ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This Filter was created by Michael J Roberts
// You can find the very good explained source Code here: http://mjrnet.org/pinscape/downloads/PinballY/Help/TopGamesExample.html
// Filter3: Top10 Tables. 
if (filter3){
	function createTopFilter(n)
	{
		let topGames;
		gameList.createFilter({
			id: "Top" + n,
			title: "Top " + n + " Rated",
			group: "[Rating]",
			sortKey: "9 Top10 " + n,  // sort after the 1-star, 2-star, etc items, before Unrated ("Z")

			// before each selection cycle, get the current Top N list
			before: function() {
				// get all of the games, sorted by descending rating, then slice to the top N
				let list = gameList.getAllGames().sort((a, b) => b.rating - a.rating).slice(0, n);

				// convert this to a Map (a hash lookup table), keyed by game ID
				topGames = new Map(list.map(g => [g.id, g]));
			},

			// filter for games in our current hash of the top N games
			select: function(game) {
				return topGames.get(game.id);
			},

			// after each cycle, free up the memory in the Top N map by
			// forgetting our reference to the map object
			after: function() {
				topGames = undefined;
			}
		});
	}

	// create a Top 10 filter
	createTopFilter(filter3_number_of_games);
}


//+++++++++++++++++++++++++++++++++++++++++++ Enhanced Top10 Tables ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// You can find the very good explained source Code here: http://mjrnet.org/pinscape/downloads/PinballY/Help/TopGamesExample.html
// Filter4: Top10 Tables, in case of ties --> show more tables with same rating

if (filter4){
	function createTopFilterPlus(n)
	{
		let topGames;
		gameList.createFilter({
			id: "Top" + n +"Plus",
			title: "Top " + n + " +", // Change shown name here
			group: "[Rating]",
			sortKey: "9 Top10Plus " + n,  // sort after the 1-star, 2-star, etc items, before Unrated ("Z")

			// before each selection cycle, get the current Top N list
			before: function() {
		        // get all of the games, sorted by descending rating
				let list = gameList.getAllGames().sort((a, b) => b.rating - a.rating);

				// include all games after the Nth game that are tied with the Nth game
				let i = n;
				while (i < list.length && list[i].rating == list[n-1].rating)
					++i;

				// slice and convert to a Map (a hash lookup table), keyed by game ID
				topGames = new Map(list.slice(0, i).map(g => [g.id, g]));
			},

			// filter for games in our current hash of the top N games
			select: function(game) {
				return topGames.get(game.id);
			},

			// after each cycle, free up the memory in the Top N map by
			// forgetting our reference to the map object
			after: function() {
				topGames = undefined;
			}
		});
	}

	// create the filter
	createTopFilterPlus(filter4_number_of_games);
}

//+++++++++++++++++++++++++++++++ Enhanced Top10 Tables 2. sorting by playtime ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// You can find the very good explained source Code here: http://mjrnet.org/pinscape/downloads/PinballY/Help/TopGamesExample.html
// Filter5: Top10 Tables, in case of ties (same rating) - playtime will be considered as second criterium for the result.

if (filter5){
	function createTopFilterSorted(n)
	{
		let topGames;
		gameList.createFilter({
			id: "Top" + n +"Sorted",
			title: "Top " + n + " (sorted by playtime)", // Change shown name here
			group: "[Rating]",
			sortKey: "9 Top10Sorted " + n,  // sort after the 1-star, 2-star, etc items, before Unrated ("Z")

			// before each selection cycle, get the current Top N list
			before: function() {
		        // get all of the games, sorted by descending rating
				//let list = gameList.getAllGames().sort((a, b) => b.rating - a.rating);
				
				let list = gameList.getAllGames().sort((a, b) => {
					// sort by rating first, then by play time
					if (a.rating != b.rating)
						return b.rating - a.rating;
					else
						return b.playTime - a.playTime;
				}).slice(0,n);

				// slice and convert to a Map (a hash lookup table), keyed by game ID
				topGames = new Map(list.map(g => [g.id, g]));
			},

			// filter for games in our current hash of the top N games
			select: function(game) {
				return topGames.get(game.id);
			},

			// after each cycle, free up the memory in the Top N map by
			// forgetting our reference to the map object
			after: function() {
				topGames = undefined;
			}
		});
	}

	// create the filter
	createTopFilterSorted(filter5_number_of_games);
}

// ############################################## GSadventure Random Game V 1.1 ################################################
// Choose a random game from current selection 
// as there is yet no function to jump to a specific gameWheel item, I need to improvise
// Goal is to have something between 1 and 35 "jumps"
// So i roughly check how many "letter-jumps" i need to perform and than some "table-jumps". 
// accelerating at the beginning and breaking down a bit at the end to give it a little bit a "Wheel of fortune"-effect
// Version 1.0
// its up and running, source code absolutely not optimized.


var show_debug_info = false; // show some Alert popups with information
var max_speed = 200; // Miliseconds between "Next" button Press 
					 // 50 tooo fast (in my setup with solenoids)
					 // 150 super fast --> minimum milisec between table change with solenoids 
                     // 250-350 medium
					 // 500-1000 slow
					 // > 1000 very slow
var no_animation = false; // set this to "true" will directly launch the choosen table
                          // but backglass, DMD, instructioncard will NOT be loaded!
						  // When quitting the table you will be at same position where you fired "start random game"



// ##############################################Spaghetti Code Start############################################

function sleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// in the main menu, add "Start random Game" after the
// Play command
let RandomGameCommand = command.allocate("RandomGameStart");
mainWindow.on("menuopen", ev => {
    if (ev.id == "main") {
        // main menu add item
        ev.addMenuItem({ after: command.PlayGame },
                { title: "Start Random Game", cmd: RandomGameCommand });
        
    }
});

// Check if "Start Random game was fired"
mainWindow.on("command", ev => {

	if (ev.id == RandomGameCommand) {     		// if random start was triggered
	  let games = gameList.getAllWheelGames();  // get all the games which are currently shown
	  
      let game_count = games.length;            // how many games in selection?
      var choosenGame = Math.floor(Math.random() * (game_count + 1)); // pick one by random
      //start choosen game  
	  //logfile.log("randomly choosen Game" + game[choosenGame].configId);

	  var i;
	  var initial_letter;      // first letter of (sorted) gamelist game
	  var initial_letter_old;  // helping var to check if inital letter changes (--> 1 letter jump)
	  var letter_jumps = 0;    // how often do i need to jump letters
	  var table_jumps;         // how often do i need to jump single tables
	  var total_jumps;         // letterjumps + tablejumps
	  
	if (show_debug_info) { alert("Choosen game is " + choosenGame + " steps way") ; }
	if (show_debug_info) { alert("Target= " + games[choosenGame].configId); }
	  
	  
	  //just to fill the inital values
	  initial_letter_old  = games[0].configId.charAt(0);
	  initial_letter      = games[0].configId.charAt(0);
    
	  // collect the initial letters and the corresponding position
	  var letters  = [];
	  var position = [];
	  
	  
      for (i = 0; i < choosenGame; i++){
		  initial_letter = games[i].configId.charAt(0);	     
    		if (initial_letter != initial_letter_old){
			  initial_letter_old = initial_letter;
			   letters.push(initial_letter); // add letter to letter array
			   position.push(i);             // add corresponding position
			} 
		  } 
	  
	  // lets build a kind of "jump logic" - how often do i need to jump from letter to letter
	  if (choosenGame > 20) { // if there are less than 20 steps to jump - no letter jump required
		  for (i = 0; i < letters.length ; i++){
			  letter_jumps++; // add 1 letter jump
			  // if less than 20 positions left until target --> stop jumping letter by letter
			  if ((choosenGame - position[i]) < 20) {
				  if ((choosenGame-position[i]) <= 0) { // last letter jump was too much (more than 20 tables within 1 letter), or choosen table ist first of a letter 
					  letter_jumps--; // go back 1 letter
					  i--;
				  }
				  break;
			  }
		  }
		  table_jumps = (choosenGame-position[i]); 
		  total_jumps = letter_jumps + (choosenGame-position[i]); 
	  }
	  else { // less than 20 tables to target - no letter jumps
		  total_jumps = choosenGame;
		  table_jumps = choosenGame;
		  letter_jumps = 0;
	     
	  }
	  
	  if (show_debug_info) { alert("total jumps" + total_jumps);}
	  if (show_debug_info) { alert("letter jumps" + letter_jumps);}
	  if (show_debug_info) { alert("table jumps" + table_jumps);}

// Returns a Promise that resolves after "ms" Milliseconds
// Damn JavaScript - good old sleep() function would be good enough. ....
const timer = ms => new Promise(res => setTimeout(res, ms))

async function turnWheel () { // We need to wrap the loop into an async function for this to work
var current_jump = 1; 
  
  // first do the letter jumps
  for (i = 0; i < letter_jumps; i++) {
	//NextPage
		 mainWindow.doButtonCommand("NextPage",true,0);
		 mainWindow.doButtonCommand("NextPage",false,0);
    await timer(get_delay(current_jump,total_jumps)); // then the created Promise can be awaited
	current_jump++;
  }
   
  // now the table jumps
  for (i = 0; i < table_jumps; i++){
	     if ( ( (i +1) == table_jumps) && ((Math.floor(Math.random() * 10)) >= 5) ){ // randomly perform or not the last jump
		    //alert("letzter Sprung entfällt");
			choosenGame--;
			break;
		 }	 
		 mainWindow.doButtonCommand("Next",true,0);
		 mainWindow.doButtonCommand("Next",false,0);
   		 await timer(get_delay(current_jump,total_jumps)); // then the created Promise can be awaited
		 current_jump++;		
   }  
	await timer(1000); 
	start_game();
  
}


// start the Animation or direct Table launch	
if (no_animation){	start_game();}
else { turnWheel();}

// accelerate and break down the wheel a bit 
function get_delay(current_jump, total_jumps){
	let accelerate= [450,200,150,100,50]; // first few jumps in milisec
	let slowdown = [100,200,350,500,750,1000]; // last few jumps in milisec
    
	
	if (total_jumps-current_jump == total_jumps - 1) { return (max_speed + accelerate[0]);}
	else if(current_jump == 1) { return (max_speed + accelerate[1]);}
	else if(current_jump == 2) { return (max_speed + accelerate[2]);}
	else if(current_jump == 3) { return (max_speed + accelerate[3]);}
	else if(current_jump == 4) { return (max_speed + accelerate[4]);}
	else if(total_jumps - current_jump == 5) { return (max_speed + slowdown[0]);}
	else if(total_jumps - current_jump == 4) { return (max_speed + slowdown[1]);}
	else if(total_jumps - current_jump == 3) { return (max_speed + slowdown[2]);}
	else if(total_jumps - current_jump == 2) { return (max_speed + slowdown[3]);}
	else if(total_jumps - current_jump == 1) { return (max_speed + slowdown[4]);}
	else if(total_jumps - current_jump == 0) { return (max_speed + slowdown[5] + (Math.floor(Math.random() * 700)));}
	else {return max_speed;}
}

async function start_game(){
	if (!show_debug_info) mainWindow.playGame(games[choosenGame]);
	if (show_debug_info) {alert("Table would launch now!")};
}
	 
} // End of "random Start found"
});	


//initialize all persistent data = lifetimePlayers as number, currentPlayers as array, readyPlayers as number, cuirrentMatch as compound tag {}
//EDIT necessary relative coords when building a new arena with this program. Ctrl+F "EDIT" to find relevant fields.
const maxPlayers =  4;  //Max amount of players allowed to be registered to a match
const minPlayers =  2; //Min amount of players needed to trigger a match to start
const minReadyPlayers = 2; //min amount of players who have to be ready for a prematch timer to skip down to 5 seconds
const prematchTimerDefault = 30; //Amount of time (in seconds, so 20-ticks intervals) before a match starts once minPlayers has been satisfied. Defauls is 30
const roundTimerDefault = 5; //Amount of time a round should last before it ends from time. Default is 120
const roundPrepTimerDefault = 20; //Amount of time players get for preparation, before the gates open and a round starts. Default is 20

//Global variables for program operation, do not touch
var prematchTimer = 30;
var isPrematchTimerTicking = false;
var primingRequired = false
var triggerRequired = false;
var triggeredAction = 0;
var primeRoundPhaseOne = false;


onEvent("item.entity_interact", event => {
	
	if (event.target.type == "minecraft:fox" & event.item.id == "minecraft:nether_star"){
	
	
	var lifetimePlayers = event.server.persistentData.gunArenaLifetimePlayersCount;
	//const addToLifetimePlayers = event.server.persistentData.gunArenaLifetimePlayersCount++
	
	Utils.server.tell("Fox Clicked")
	Utils.server.tell("lifetimePlayers is " + lifetimePlayers)	
	
	return
	}
	
	/*Utils.server.tell( event.player.stages.has('starting_items'))
	event.player.stages.remove('starting_items')
	Utils.server.tell(event.player.stages.has('starting_items'))*/
	
	//Utils.server.tell(event.item.name)
	//Utils.server.tell(event.player.x)
	//Utils.server.tell(event.position)
	//Utils.server.runCommand("summon fox " + event.player.x + ' ' + event.player.y + ' ' + event.player.z)
	
	if (event.target.type == "minecraft:fox" & event.item.id == "minecraft:diamond") {
	Utils.server.tell("Fox Clicked with Diamond")
	//Utils.server.tell("Bool is " + currentMatch().IsOngoing);
	//addToLifetimePlayers(1)
	//event.server.persistentData.gunArenaCurrentPlayers = [{"PlayerNumber":"1","Name":"Ahri_Loyala","Team":"Blue"},{"PlayerNumber":"2","Name":"Raven_Blackblood","Team":"Red"}]
	//Utils.server.tell("Lifetime players is now: " + lifetimePlayers)
	return
	}
	
	//event.player.inventory.removeItem(!nonCapsule)
	
	function resetLifetimePlayers(){
		let data = event.server.persistentData.gunArenaLifetimePlayersCount
		event.server.persistentData.gunArenaLifetimePlayersCount = 0//{"count": 1}
		return data
	}
	
	function addToLifetimePlayers(number){
		let data = event.server.persistentData.gunArenaLifetimePlayersCount
		event.server.persistentData.gunArenaLifetimePlayersCount = event.server.persistentData.gunArenaLifetimePlayersCount + number
		return data
	}
	
})


function mathTest(number){
	let maf = 1 + number
	return maf
}

onEvent("command.registry", event => {
	const { commands: Commands, arguments: Arguments} = event;
	//var lifetimePlayers = event.server.persistentData.gunArenaLifetimePlayersCount;
	
	function addToLifetimePlayers(number){
		let data = event.server.persistentData.gunArenaLifetimePlayersCount
		event.server.persistentData.gunArenaLifetimePlayersCount = event.server.persistentData.gunArenaLifetimePlayersCount + number
		return data;
	}
	
	function resetLifetimePlayers(){
		let data = event.server.persistentData.gunArenaLifetimePlayersCount
		event.server.persistentData.gunArenaLifetimePlayersCount = 0//{"count": 1}
		return data;
	}
	
	function initializeCurrentPlayers(pvalue, resetBool){
		//JSON Array Format is [{"PlayerNumber":"1","Name":"Ahri_Loyala","Team":"Blue"},{"PlayerNumber":"2","Name":"Raven_Blackblood","Team":"Red"}]
		
		//const currentPlayers = 
		const changePlayers = (p) => {return event.server.persistentData.gunArenaCurrentPlayers = p;}
		//let resetPlayers = changePlayers([])
		if (resetBool){changePlayers([]); return;}
		Utils.server.tell('initializeCurrentPlayers Function Called')	
	}
	
	function pushCurrentPlayers(playerName, playerNumber){
		//const currentPlayers = event.server.persistentData.gunArenaCurrentPlayers
		let player = `{"PlayerNumber":"${playerNumber}","Name":"${playerName}","Team":"Random","Ready":false}`
		event.server.persistentData.gunArenaCurrentPlayers.push(JSON.parse(player))
		return;
	}
	
	//number is players to add or remove, team is what team to add or remove to
	//for team, 1 = Blue, 2 = red, 3 = random, 0 or any other number = reset (set both teams to 0 players)
	function changeTeamsPlayersCount(number, team) {		

		//its broke // const setCount = (n, teamName) => {let t = event.server.persistentData.gunArenaTeamsPlayersCount; Utils.server.tell("setCount's teamName is " + teamName + "and type is " + typeof(teamName)); return t.teamKey += n;}
		const setBlueCount = (n) => {return event.server.persistentData.gunArenaTeamsPlayersCount.Blue += n;};
		const setRedCount = (n) => {return event.server.persistentData.gunArenaTeamsPlayersCount.Red += n;};
		const setRandomCount = (n) => {return event.server.persistentData.gunArenaTeamsPlayersCount.Random += n;};
		//setCount(1, 'Blue')
		//event.server.persistentData.gunArenaTeamsPlayersCount.Red += 1;
		//Utils.server.tell('String test: ' + )
		switch (team) {			
			case 1: setBlueCount(number); break;
			case 2: setRedCount(number); break;
			case 3: setRandomCount(number); break;
			default: event.server.persistentData.gunArenaTeamsPlayersCount = {"Blue":0,"Red":0,"Random":0};
			Utils.server.tell("Blue team is: " + teamsPlayersCount().Blue + ". Red team is: " + teamsPlayersCount().Red)
		}					
	}
	
	
//---------------RNG STUFF---------------		
	const getRandomInt = (max) => {return Math.floor(Math.random() * max)};

	function assignToTeamRandom (team) {
		let randomPlayers = getRandomTeamPlayers();    
		let r = getRandomInt(randomPlayers.length);
		let chosenPlayer = currentPlayers()[(randomPlayers[r])];  	
		chosenPlayer.Team = team;
		Utils.server.runCommand(`tag ${chosenPlayer.Name} remove ga_random_team`);
		Utils.server.runCommand(`tag ${chosenPlayer.Name} add ga_${team.toLowerCase()}_team`);
	  return  
	}

	function getRandomTeamPlayers() {
	  let array = []
	  
	  for (let i =0; i < currentPlayers().length; i++) {    
		if (currentPlayers()[i].Team == "Random") {
		  //changeTeamsPlayersCount(1 , 3); //randomPlayersCount++; //substitute for changeTeamsPlayers to add a player to Random team key um what was this for???
		  array.push(currentPlayers()[i].PlayerNumber - 1);
		}
	  } 
	  return array;
	}
//---------------RNG STUFF---------------
	
	
	const lifetimePlayersCount = () => {return event.server.persistentData.gunArenaLifetimePlayersCount};
	const currentPlayers = () => {return event.server.persistentData.gunArenaCurrentPlayers};
	const readyPlayers = () => {return event.server.persistentData.gunArenaReadyPlayers};
	const changeReadyPlayers = (p) => {return event.server.persistentData.gunArenaReadyPlayers = p};
	const teamsPlayersCount = () => {return event.server.persistentData.gunArenaTeamsPlayersCount};
	
	const currentMatch = () => {return event.server.persistentData.gunArenaCurrentMatch};
	const resetCurrentMatch = () => {let m = `{"IsOngoing":false,"TotalTime":0,"RoundTimer":120,"RoundNumber":0,"BluePoints":0,"RedPoints":0,"BluePlayers":0,"RedPlayers":0}`; event.server.persistentData.gunArenaCurrentMatch = {}; event.server.persistentData.gunArenaCurrentMatch = (JSON.parse(m));};
	const addToCurrentMatchTime = (p) => {return event.server.persistentData.gunArenaCurrentMatch.TotalTime += p};
	const resetCurrentMatchTime = () => {event.server.persistentData.gunArenaCurrentMatchTime = 0};
	
	event.register(
		Commands.literal('vps-gunarena')
			.requires(src => src.hasPermission(2))
			.then(Commands.literal('card')	
				.then(Commands.argument('rel-pos-x', Arguments.INTEGER.create(event))
					.then(Commands.argument('rel-pos-y', Arguments.INTEGER.create(event))
						.then(Commands.argument('rel-pos-z', Arguments.INTEGER.create(event))
							.executes(ctx => {
								const relPosX = Arguments.INTEGER.getResult(ctx, "rel-pos-x");
								const relPosY = Arguments.INTEGER.getResult(ctx, "rel-pos-y");
								const relPosZ = Arguments.INTEGER.getResult(ctx, "rel-pos-z");
								const pos = ctx.source.position
								let posX = Math.floor(pos.x())
								let posY = Math.floor(pos.y())
								let posZ = Math.floor(pos.z())
								let paddedId = lifetimePlayersCount().toString().padStart(5,0)
								
								addToLifetimePlayers(1)
								//Utils.server.runCommand('data merge block ' + (posX + relPosX)+ ' ' + (posY + relPosY) + ' ' + (posZ + relPosZ) + ` {Items:[{Slot:0b,id:"create_things_and_misc:card", Count: 1b, tag:{Inscribed:"Vulpine Co. [stage1-valid]",display:{Name:'[{"text":"Gun Arena ID-${paddedId}","italic":false}]'}}}]}`)
								Utils.server.runCommand('data merge block ' + (posX + relPosX)+ ' ' + (posY + relPosY) + ' ' + (posZ + relPosZ) + ` {Items:[{Slot:0b,id:"create_things_and_misc:card", Count: 1b, tag:{Inscribed:"Vulpine Co. [stage1-valid]",display:{Name:'[{"text":"Gun Arena ID-${paddedId}","italic":false}]',Lore:['[{"text":"| CARD ID: ${paddedId} | STATUS: Valid Entry Ticket |","italic":false}]']}}}]}`)
								Utils.server.tell("Put a diamond in chest above, and coords used were: " + posX + ' ' + (posY + 1) + ' ' + posZ)								
								return 1
							})
						)	
					)	
				)	
			)	
			.then(Commands.literal('stage-two').executes(ctx => {
				//Commences stage 2 of Card, setting Card Inscribed NBT to Stage 2 and binding card to player				
					
				//let inventory = entityData.inventory.contains('create_things_and_misc:card') /use to check for item :D
				//let $tagList = java('net.minecraft.nbt.ListTag') DO NOT USE
				//let $JSONtoNBT = java('net.minecraft.nbt.TagParser') DO NOT USE
				let entityData = ctx.source.entity
				let size = entityData.getInventory().containerSize
				//let name = entityData.name.contents
				
				for (let slot = 0; slot < (size); slot++) {
				let invSlotId = entityData.getInventory().getItem(slot).serializeNBT().id //get ID from NBT of item
				
				//Utils.server.tell("Slot " + slot + " has an id of " + invSlotId)	
				
				//Loops through inventory finding cards matching the right NBT, and takes the first one it finds.
					if (invSlotId == "create_things_and_misc:card") {
						//Utils.server.tell("SUCCESFULLY FOUND A CARD");
						let cardTag = entityData.getInventory().getItem(slot).getTag().Inscribed //get the NBT dat adown to the Inscribed key for validation
						
						if (cardTag == "Vulpine Co. [stage1-valid]") {
							if (entityData.stages.has('ga_registered_player')) {event.server.tell("Found a valid Card, but you are already registered!"); return;}
							if (currentPlayers().length >= maxPlayers) {event.server.tell("Found a valid Card, but player slots are full! Please wait until the next match."); return;}
							if (currentMatch().IsOngoing) {event.server.tell("Found a valid Card, but a match is currently underway! Please wait warmly until the next match."); return;}
							
							let nameString = entityData.getInventory().getItem(slot).getTag().display.Name // get display name of Card item
							let nameRegex = /(.")(,)/
							let nameIndex = nameString.search(nameRegex)
							let playerName = entityData.name.contents
							let stringifiedPlayerName = ""
							stringifiedPlayerName = stringifiedPlayerName + playerName;
							let modifiedName = nameString.substring(0, (nameIndex + 1)) + ` ${stringifiedPlayerName} ` + nameString.substring((nameIndex + 1))
							
							//entityData.runCommand(`tp Ahri_Loyala ~ ~ ~`)
							Utils.server.runCommand(`execute as ${stringifiedPlayerName} run vps-gunarena functions add-pipe-segment ${slot} 1 "PLAYER ${currentPlayers().length + 1}: ${stringifiedPlayerName}"`)
							Utils.server.runCommand(`execute as ${stringifiedPlayerName} run vps-gunarena functions mod-pipe-segment ${slot} 3 "STATUS: Prematch"`)
							event.server.tell(`Found a valid Card! You have been registered as Player ${currentPlayers().length + 1}.`); //not sure if this will whisper or tell the whole server
							entityData.getInventory().getItem(slot).getTag().display.Name = modifiedName;
							entityData.getInventory().getItem(slot).getTag().Inscribed = "Vulpine Co. [stage2-prematch]"; //Set the NBT tag to stage2
							pushCurrentPlayers(stringifiedPlayerName, (currentPlayers().length + 1));
							entityData.addTag('ga_registered_player');
							entityData.addTag('ga_random_team');
							changeTeamsPlayersCount(1, 3);
							break;
						} else {continue};
					};	// else Utils.server.tell("No Card Found");	//else invSlotId == "minecraft:air";
				};
				return 1
				})
			)
			.then(Commands.literal('stage-three')
				.then(Commands.literal('init').executes(ctx => {															
					if (currentPlayers().length < minPlayers || isPrematchTimerTicking) {return;}
					prematchTimer = prematchTimerDefault
					Utils.server.tell("Minimum amount of players are present. Match starting soon!")
					//Upon trigger, periodic checks to see if a match is viable; that is, two or more players are registered or whateve minPlayers is set to
					recursiveTimer()
					isPrematchTimerTicking = true;
					
					function recursiveTimer(){
						
						if (readyPlayers() >= minReadyPlayers && prematchTimer > 5) {prematchTimer = 5;}
						if (prematchTimer <= 0) {
							if ((teamsPlayersCount().Blue <= 1 && teamsPlayersCount().Random < 1) || (teamsPlayersCount().Red <= 1 && teamsPlayersCount().Random < 1)) 
								{prematchTimer = 5; Utils.server.tell("Cannot start match with an empty team. Try again."); return;}
							Utils.server.tell("MATCH HAS STARTED");
							prematchTimer = prematchTimerDefault;
							isPrematchTimerTicking = false;
							changeReadyPlayers(0);
							let pos = ctx.source.position;							
							Utils.server.runCommand(`setblock ${Math.floor(pos.x())} ${Math.floor(pos.y()) + 1} ${Math.floor(pos.z())} minecraft:redstone_block`);							
							return;
							}
							
						Utils.server.tell("Match starts in " + prematchTimer + " and there are " + readyPlayers() + " players ready");
						prematchTimer--;
						event.server.scheduleInTicks(20, callback => {
							recursiveTimer();
						})	
					}
					//return
					return 1
					})
				)
				.then(Commands.literal('join-team')
					.then(Commands.argument('team', Arguments.INTEGER.create(event)).executes(ctx => {
						
						const arg1 = Arguments.INTEGER.getResult(ctx, "team"); //1 = Blue, 2 = Red, 3 = Random (default)												
						let deObjPassedTeam = 0 + arg1;						
						let playerName = ctx.source.entity.name.contents;
						let stringifiedPlayerName = ""
						stringifiedPlayerName = stringifiedPlayerName + playerName;
						let entityData = ctx.source.entity;						
						const blueTag = () => {return entityData.stages.has('ga_blue_team');};
						const redTag = () => {return entityData.stages.has('ga_red_team');};
						const randomTag = () => {return entityData.stages.has('ga_random_team');};
						const addTag = (tag) => {entityData.stages.add(tag)};
						const removeTag = (tag) => {entityData.stages.remove(tag)};
						let deObjArg1 = 1;	
						let size = entityData.getInventory().containerSize
						Utils.server.tell("type of deObjArg1 is " + typeof(parseInt(arg1)) + " and value is " + deObjArg1)
						for (let slot = 0; slot < (size); slot++) {
							let invSlotId = entityData.getInventory().getItem(slot).serializeNBT().id;		
							if (invSlotId == "create_things_and_misc:card") {
								//Utils.server.tell("SUCCESFULLY FOUND A CARD");
								let cardTag = entityData.getInventory().getItem(slot).getTag().Inscribed;
								if (cardTag == "Vulpine Co. [stage2-prematch]") {														
									switch (parseInt(arg1)) {
									case 1: if (blueTag()) {return;}
										Utils.server.tell('join-team blue team detected');
										addTag('ga_blue_team');
										Utils.server.runCommand(`execute as ${stringifiedPlayerName} run vps-gunarena functions assign-to-team ${arg1}`);
										changeTeamsPlayersCount(1 , 1);
										if (redTag()) {changeTeamsPlayersCount(-1 , 2); removeTag('ga_red_team');}
										if (randomTag()) {removeTag('ga_random_team'); changeTeamsPlayersCount(-1 , 3);}
										break;
									case 2: if (redTag()) {return;}
										Utils.server.tell('join-team red team detected');
										addTag('ga_red_team');
										Utils.server.runCommand(`execute as ${stringifiedPlayerName} run vps-gunarena functions assign-to-team ${arg1}`);
										changeTeamsPlayersCount(1 , 2);
										if (blueTag()) {changeTeamsPlayersCount(-1 , 1); removeTag('ga_blue_team');}
										if (randomTag()) {removeTag('ga_random_team'); changeTeamsPlayersCount(-1 , 3);}
										break;
									case 3: if (randomTag()) {return;}
										Utils.server.tell('join-team random team detected');
										addTag('ga_random_team');
										Utils.server.runCommand(`execute as ${stringifiedPlayerName} run vps-gunarena functions assign-to-team ${arg1}`);
										changeTeamsPlayersCount(1 , 3);
										if (blueTag()) {changeTeamsPlayersCount(-1 , 1); removeTag('ga_blue_team');}
										if (redTag()) {changeTeamsPlayersCount(-1 , 2); removeTag('ga_red_team');}
										break;
										
									};
								} else {continue};
							};													
						};
						
						
						event.server.tell('Join team Command end')
						
						return 1
					})
					)
				)
			)
			.then(Commands.literal('stage-four')
				.then(Commands.literal('init-randomize')
					.executes(ctx => {
					Utils.server.tell('Stage Four Initialized');
					let pos = ctx.source.position;							
					Utils.server.runCommand(`setblock ${Math.floor(pos.x())} ${Math.floor(pos.y()) - 1} ${Math.floor(pos.z())} minecraft:air`);					
					
					//Randomly but evenly distributes players who picked "Random Team" between blue and red team, and if player did not pick a team, they are random by default
					function stageFourFillTeams() {
					  let list = getRandomTeamPlayers();  
					  Utils.server.tell("Array of random players: " + list);
					  for (let i = list.length; i > 0; i--) {
						let bluePlayers = teamsPlayersCount().Blue;
						let redPlayers = teamsPlayersCount().Red;						
						switch (true) {
						  case (redPlayers > bluePlayers): assignToTeamRandom("Blue"); changeTeamsPlayersCount(-1, 3); changeTeamsPlayersCount(1, 1); break;
						  case (bluePlayers > redPlayers): assignToTeamRandom("Red"); changeTeamsPlayersCount(-1, 3); changeTeamsPlayersCount(1, 2); break;
						  default: if (getRandomInt(2)) {assignToTeamRandom("Blue"); changeTeamsPlayersCount(-1, 3); changeTeamsPlayersCount(1, 1);} else {assignToTeamRandom("Red"); changeTeamsPlayersCount(-1, 3); changeTeamsPlayersCount(1, 2);}      
						}
					  } 
					}
					stageFourFillTeams();
					return 1	
					})
				)
				.then(Commands.literal('init-match-begin') //EDIT RELATIVE POSITION command arguments when setting up the command block. These are meant to power the Team Command blocks + Watchdog that will summon players to their respective team locations.
					.then(Commands.argument('rel-pos-x-one', Arguments.INTEGER.create(event))
						.then(Commands.argument('rel-pos-y-one', Arguments.INTEGER.create(event))
							.then(Commands.argument('rel-pos-z-one', Arguments.INTEGER.create(event))
								.then(Commands.argument('rel-pos-x-two', Arguments.INTEGER.create(event))
									.then(Commands.argument('rel-pos-y-two', Arguments.INTEGER.create(event))
										.then(Commands.argument('rel-pos-z-two', Arguments.INTEGER.create(event))
											.then(Commands.argument('rel-pos-x-three', Arguments.INTEGER.create(event))
												.then(Commands.argument('rel-pos-y-three', Arguments.INTEGER.create(event))
													.then(Commands.argument('rel-pos-z-three', Arguments.INTEGER.create(event))
														.executes(ctx => {
														const relXOne = Arguments.INTEGER.getResult(ctx, "rel-pos-x-one"); //Relative coords to Blue Team Command Block X position
														const relYOne = Arguments.INTEGER.getResult(ctx, "rel-pos-y-one");
														const relZOne = Arguments.INTEGER.getResult(ctx, "rel-pos-z-one");
														const relXTwo = Arguments.INTEGER.getResult(ctx, "rel-pos-x-two"); //Relative coords to Red Team Command Block X position
														const relYTwo = Arguments.INTEGER.getResult(ctx, "rel-pos-y-two");
														const relZTwo = Arguments.INTEGER.getResult(ctx, "rel-pos-z-two");
														const relXThree = Arguments.INTEGER.getResult(ctx, "rel-pos-x-three"); //Relative coords to Watchdog Command Block X position (should be in one of the corners of the arena, keeps approved_entities inside)
														const relYThree = Arguments.INTEGER.getResult(ctx, "rel-pos-y-three");
														const relZThree = Arguments.INTEGER.getResult(ctx, "rel-pos-z-three");
														const pos = ctx.source.position;
														let posX = Math.floor(pos.x());
														let posY = Math.floor(pos.y());
														let posZ = Math.floor(pos.z());
														
														//Activate Team Command blocks via redstone
														Utils.server.runCommand(`setblock ${posX + relXOne} ${posY + relYOne} ${posZ + relZOne} minecraft:redstone_block`);
														Utils.server.runCommand(`setblock ${posX + relXTwo} ${posY + relYTwo} ${posZ + relZTwo} minecraft:redstone_block`);
														Utils.server.runCommand(`execute as @e[type=minecraft:player,tag=ga_registered_player] run tag @s add ga_approved_entity`);
														Utils.server.runCommand(`setblock ${posX + relXThree} ${posY + relYThree} ${posZ + relZThree} minecraft:redstone_block`);
														Utils.server.tell('init-match-begin');
														return 1	
														})
													)
												)
											)
										)
									)
								)
							)
						)
					)
				)
				.then(Commands.literal('players-summon') //Gets players of respective teams to the start of the match and each round and resets whatever needs resetting per team player
					.then(Commands.argument('team-tag', Arguments.STRING.create(event))
						.executes(ctx => {
						const arg1 = Arguments.STRING.getResult(ctx, "team-tag"); 
						const pos = ctx.source.position;
						let posX = Math.floor(pos.x());
						let posY = Math.floor(pos.y());
						let posZ = Math.floor(pos.z());
						const spawnSpread = 2; //EDIT The maximum amount of blocks away from the center of the Team Room that players will spawn in (set this to the size of the Team Room where 1 = 1x1 area, 2 = 3x3 area, 3 = 5x5 area...)
						const randomSpawnGen = () => {let r = Math.floor(Math.random() * spawnSpread); if (Math.floor(Math.random() * 2)) {r *= -1}; return r};
						Utils.server.runCommand(`setblock ${posX} ${posY - 1} ${posZ} minecraft:air`);
						Utils.server.runCommand(`execute as @e[type=minecraft:player,tag=${arg1}] run tp @s ${posX + randomSpawnGen()} ${posY + 2} ${posZ + randomSpawnGen()}`);																	
						return 1
						})
					)
				)
				.then(Commands.literal('start-match-ticker') //Gets players of respective teams to the start of the match and each round and resets whatever needs resetting per team player
					.then(Commands.argument('rel-pos-x-one', Arguments.INTEGER.create(event))
						.then(Commands.argument('rel-pos-y-one', Arguments.INTEGER.create(event))
							.then(Commands.argument('rel-pos-z-one', Arguments.INTEGER.create(event))
								.executes(ctx => {
								const relXOne = Arguments.INTEGER.getResult(ctx, "rel-pos-x-one"); //Relative coords to Blue Team Command Block X position
								const relYOne = Arguments.INTEGER.getResult(ctx, "rel-pos-y-one");
								const relZOne = Arguments.INTEGER.getResult(ctx, "rel-pos-z-one");

								const pos = ctx.source.position;
								let posX = Math.floor(pos.x());
								let posY = Math.floor(pos.y());
								let posZ = Math.floor(pos.z());
								
								const redstoneBlock = (relX, relY, relZ) => {Utils.server.runCommand(`setblock ${posX + relX} ${posY + relY} ${posZ + relZ} minecraft:redstone_block`)}; //redstone blocks placed at relative XYZ coords used to trigger command blocks
								const getTimeToNextAction = (seconds, offset) => {return currentMatch().TotalTime + (seconds + offset);}; //The offset is becase it takes 2 seconds in total  for the game loop to register that then actually triggger something
								
								let internalTimerOne = getTimeToNextAction(roundTimerDefault, 0);
								let nextTrigger = 0;
								
								resetCurrentMatch();
								event.server.persistentData.gunArenaCurrentMatch.IsOngoing = true; //Set flag that match is underway. Game loop stops if this flag is false
								event.server.persistentData.gunArenaCurrentMatch.BluePlayers = teamsPlayersCount().Blue; //teamsPlayersCount is doubling as a cached count of players that will be used to actually keep track
								event.server.persistentData.gunArenaCurrentMatch.RedPlayers = teamsPlayersCount().Red;   //of who the winning team of a round is by being subtracted whenever a player of that team is killed
								matchTicker();
								redstoneBlock(1, 0, 0);
								
								//Main game loop of GunArena that handles events throughout a live match
								function matchTicker () {
									if (!currentMatch().IsOngoing) {return;}
									addToCurrentMatchTime(1);
									Utils.server.tell("Match ticking. Total match time is: " + currentMatch().TotalTime); 
									if (currentMatch().TotalTime == internalTimerOne) {
										internalTimerOne = getTimeToNextAction(roundTimerDefault, 0); //The offset is canceled here because it is not needed for inner timers set from outside the function
										Utils.server.tell("Internal timer triggered!");
									}
									
									if (primingRequired) {
										switch (true) {
											case primeRoundPhaseOne:
												nextTrigger = getTimeToNextAction(roundPrepTimerDefault, -2); 
												Utils.server.tell("Round Phase One Primed");
												primingRequired = false;
												primeRoundPhaseOne = false
												triggerRequired = true;
												triggeredAction = 1;
												break;
										}
									}
									
									if (triggerRequired && currentMatch().TotalTime == nextTrigger) {
										switch (triggeredAction) {
											case 1: //Trigger Phase one (open the gates)
												redstoneBlock(1, 0, 1);
												break;
										}
									}
									
									event.server.scheduleInTicks(20, callback => {
										matchTicker();
									})										
								}
								
								return 1
								})
							)
						)
					)
				)
				.then(Commands.literal('round-handler')					
					.then(Commands.literal('phase-one')
						.then(Commands.literal('primer')
							.executes(ctx => {
								const pos = ctx.source.position;
								let posX = Math.floor(pos.x());
								let posY = Math.floor(pos.y());
								let posZ = Math.floor(pos.z());
								
								Utils.server.runCommand(`setblock ${posX} ${posY - 1} ${posZ} minecraft:air`);
								primingRequired = true;
								primeRoundPhaseOne = true;								
								return 1
							})
						)
						.then(Commands.literal('trigger')
						)
					)
					.then(Commands.literal('phase-two')
						.then(Commands.literal('primer')
						)
						.then(Commands.literal('trigger')
						)
					)				
				)
			)
			.then(Commands.literal('currentplayers')
				.then(Commands.literal('query').executes(ctx => {
					initializeCurrentPlayers(null, 0)
					Utils.server.tell("Current Player Count is " + currentPlayers())
					//Utils.server.tell("Keys are " + Object.keys(currentPlayers[0]))
					Utils.server.tell("Length is: " + currentPlayers().length)
					return 1
					})
				)
				.then(Commands.literal('reset').executes(ctx => {
					
					initializeCurrentPlayers(0, 1)
					Utils.server.tell("Current Player Count is " + currentPlayers())
					
					return 1
					})
				)
				.then(Commands.literal('build').executes(ctx => {
					//USELESS, FOR REMOVAL
					//Object.assign(event.server.persistentData.gunArenaCurrentPlayers[0], {Kils: "0"})
					Utils.server.tell("Player 1 is " + event.server.persistentData.gunArenaCurrentPlayers[0])
					//event.server.persistentData.gunArenaCurrentPlayers[0]['Kills'] = "0"
					Utils.server.tell("Pushed to Current Players, and it is now: " + currentPlayers())
					
					return 1
					})
				)
			)
			.then(Commands.literal('lifetime-players')
				.then(Commands.literal('query').executes(ctx => {
					Utils.server.tell("Total Player Count is " + lifetimePlayersCount())
					//Utils.server.tell("Type of Player Count is " + typeof(lifetimePlayers))
					return 1
					})
				)
				.then(Commands.literal('reset').executes(ctx => {
					Utils.server.tell("Total Player Count was " + lifetimePlayersCount())
					resetLifetimePlayers()
					Utils.server.tell("Total Player Count is now " + lifetimePlayersCount())
					return 1
					})
				)
				.then(Commands.literal('test').executes(ctx => {
					Utils.server.tell("Total Player Count was " + lifetimePlayersCount())
					addToLifetimePlayers(1)
					Utils.server.tell("Total Player Count is now " + lifetimePlayersCount())
					return 1
					})
				)
			) 
			.then(Commands.literal('functions') //collection of subcommands to serve as functions to be called inside other commands to get stuff done. Pls dont @ me im just trying to follow DRY principle Sadge
				.then(Commands.literal('init-persistent-data') //initalizes (and resets) all persistent server data related to GunArena, for debugging as well as first-time setup
					.executes(ctx => {
						initializeCurrentPlayers(0, 1);
						changeReadyPlayers(0);
						return 1
					})
				)
				.then(Commands.literal('mod-pipe-segment')
					.then(Commands.argument('slot', Arguments.INTEGER.create(event))
						.then(Commands.argument('pipe-index', Arguments.INTEGER.create(event))
							.then(Commands.argument('new-lore', Arguments.STRING.create(event))
								.executes(ctx => {
									const arg1 = Arguments.INTEGER.getResult(ctx, "slot")
									const arg2 = Arguments.INTEGER.getResult(ctx, "pipe-index")								
									const arg3 = Arguments.STRING.getResult(ctx, "new-lore")
									modPipeSegment(arg1, arg2, arg3)									
									//modifies a single pipe segment in Card lore selected by pipeIndex with a 1-index
									//command argumetns are item slot, pipe index, and then string message that will be new lore
									//BUG: DO NOT USE ' character in the string, or there will be an error
									function modPipeSegment (slot, pipeIndex, newLore) {
										let entityData = ctx.source.entity
										const getLore = () => {return String.raw`${entityData.getInventory().getItem(slot).getTag().display.Lore}`;}
										const modifyLore = (p) => {entityData.getInventory().getItem(slot).getTag().display.Lore = eval(p);}
										const buildRegex = (i) => {return RegExp(String.raw`((?:.*?\|){${i}}).*$`);}
										let stringStartIndex = getLore().match(buildRegex(pipeIndex))[1].length;
										let stringEndIndex = getLore().match(buildRegex(pipeIndex + 1))[1].length;
										let modifiedLore = getLore().substring(0, (stringStartIndex + 1)) + newLore + getLore().substring((stringEndIndex - 2))
										modifyLore(modifiedLore);										
									}
									return 1
								})
							)
						)
					)
				)
				.then(Commands.literal('add-pipe-segment')
					.then(Commands.argument('slot', Arguments.INTEGER.create(event))
						.then(Commands.argument('pipe-index', Arguments.INTEGER.create(event))
							.then(Commands.argument('new-lore', Arguments.STRING.create(event))
								.executes(ctx => {
									const arg1 = Arguments.INTEGER.getResult(ctx, "slot")
									const arg2 = Arguments.INTEGER.getResult(ctx, "pipe-index")								
									const arg3 = Arguments.STRING.getResult(ctx, "new-lore")
									modPipeSegment(arg1, arg2, arg3)									
									//Pushes a single pipe segment in Card lore at position selected by pipeIndex with a 1-index
									//command argumetns are item slot, pipe index, and then string message that will be new lore
									//BUG: CANNOT PUSH AFTER LAST PIPE SEGMENT. WILL BRICK CARD LORE KEKW Probably fixable by regex but it is functional for the current use case
									//BUG: DO NOT USE ' character in the string, or there will be an error
									function modPipeSegment (slot, pipeIndex, newLore) {
										let entityData = ctx.source.entity
										const getLore = () => {return String.raw`${entityData.getInventory().getItem(slot).getTag().display.Lore}`;}
										const modifyLore = (p) => {entityData.getInventory().getItem(slot).getTag().display.Lore = eval(p);}
										const buildRegex = (i) => {return RegExp(String.raw`((?:.*?\|){${i}}).*$`);}
										let stringStartIndex = getLore().match(buildRegex(pipeIndex))[1].length;
										let stringEndIndex = stringStartIndex - 1;
										let modifiedLore = getLore().substring(0, (stringStartIndex + 1)) + newLore + ' ' + getLore().substring((stringEndIndex ))
										modifyLore(modifiedLore);
										
										//Debugging messages
										/*
										Utils.server.tell("Obj: " + getLore())
										Utils.server.tell("Regex is: " + RegExp(buildRegex(pipeIndex)))
										Utils.server.tell("Captured Index is: " + stringStartIndex)
										Utils.server.tell("Captured start letter is: " + getLore()[stringStartIndex+1])
										Utils.server.tell("Captured end letter is: " + getLore()[stringEndIndex-3])
										Utils.server.tell("Modified NBT: " + modifiedLore)
										*/										
									}
									return 1
								})
							)
						)
					)
				)
				.then(Commands.literal('assign-to-team') //assigns players to teams where 1 = blue, 2 = red, 3 = random
					.then(Commands.argument('team', Arguments.INTEGER.create(event))
						.executes(ctx => {							
							const arg1 = Arguments.INTEGER.getResult(ctx, "team");
							let assignedTeam = '';
							let playerIndex = 0;
							let entityData = ctx.source.entity;
							let size = entityData.getInventory().containerSize;														
							for (let slot = 0; slot < (size + 5); slot++) {
							let invSlotId = entityData.getInventory().getItem(slot).serializeNBT().id //get ID from NBT of item													
							
							//Loops through inventory finding cards matching the right NBT, and takes the first one it finds and gets Player number from inscribed to find player index in JSON array
								if (invSlotId == "create_things_and_misc:card") {									
									let cardTag = entityData.getInventory().getItem(slot).getTag().Inscribed //get the NBT dat adown to the Inscribed key for validation
									
									if (cardTag == "Vulpine Co. [stage2-prematch]") {																				
										let getLore = () => {return String.raw`${entityData.getInventory().getItem(slot).getTag().display.Lore}`;};
										playerIndex = getLore().charAt(21) - 1;																																																	
										break;
									} else {continue};
								};
							};																					
							assignToTeam(arg1)
							function assignToTeam (passedTeam) {
								//let deObjPassedTeam = 0 + passedTeam; //REUSE ONLY IF STUFF BREAKS. Convert the integer that arrives as an object to a number for use with switch								
								
								switch (parseInt(passedTeam)) {
									case 1: assignedTeam = "Blue"; break;
									case 2: assignedTeam = "Red"; break;
									case 3: assignedTeam = "Random"; break;
									default: assignedTeam = "Random";								
								}	
								currentPlayers()[playerIndex].Team = assignedTeam; //Sets the chosen team to player's JSON entry
								if (!currentPlayers()[playerIndex].Ready) {currentPlayers()[playerIndex].Ready = true; changeReadyPlayers(readyPlayers()+1)}; //Sets the player as ready so they cannot double up and adds to readyPlayers counter
								event.server.tell("Your new team is: " + currentPlayers()[playerIndex].Team)
								return;	
							}							
							return 1
						})
					)
				)
				.then(Commands.literal('ready-players')
					.then(Commands.argument('reset-bool', Arguments.INTEGER.create(event))
						.executes(ctx => {
						const arg1 = Arguments.INTEGER.getResult(ctx, "reset-bool");
						
						//Utils.server.tell("Number of players ready was: " + readyPlayers());
						
						Utils.server.tell("Number of players ready is: " + readyPlayers());
						if (arg1){changeReadyPlayers(0); Utils.server.tell("readyPlayers is now " + readyPlayers());}
						return 1
							
						})
					)
				)
				.then(Commands.literal('teams-players-count')
					.then(Commands.argument('reset-bool', Arguments.INTEGER.create(event))				
						.executes(ctx => {					
						const arg1 = Arguments.INTEGER.getResult(ctx, "reset-bool");
												
						let entityData = ctx.source.entity;						
						Utils.server.tell("teamsPlayersCount is: " + teamsPlayersCount())
						if (arg1) {changeTeamsPlayersCount(1, 0); Utils.server.tell("teamsPlayersCount is now " + teamsPlayersCount());}
						return 1
							
						})
					)
				)
		)
		.then(Commands.literal('test')				
			.executes(ctx => {
			Utils.server.tell("test command for match timer")
			//let entityData = ctx.source.entity;			
			//Utils.server.tell("readyPlayers was: " + readyPlayers())
			//changeTeamsPlayersCount(1, 0)
			Utils.server.tell("teamsPlayersCount is: " + teamsPlayersCount())									
			
			//let rpl = getRandomTeamPlayers();
			//resetCurrentMatch()
			Utils.server.tell("Full obj: " + currentMatch());
			
			return 1
			})			
		)
		.then(Commands.literal('BLANK').executes(ctx => {

			//Add code here
			//For copy-pasting purposes
			//KEEP RETURN
			return 1
			})
		)
	)  	
})


onEvent("entity.death", event => {
	const currentMatch = () => {return event.server.persistentData.gunArenaCurrentMatch}; //sadly some of these have to be repeated per event as I can't figure out how to make them global
	
	
	
	
	if (!currentMatch().IsOngoing) {return;}
	if (event.entity.type == "minecraft:polar_bear") {Utils.server.tell("Keys of entity are: " + Object.keys(event.entity));}
			
	
	
})
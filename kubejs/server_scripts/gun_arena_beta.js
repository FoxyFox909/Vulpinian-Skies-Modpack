
//initialize all persistent data = lifetimePlayers as number, currentPlayers as array, readyPlayers as number, currentMatch as compound tag {}
//EDIT necessary relative coords when building a new arena with this program. Ctrl+F "EDIT" to find relevant fields.
const maxPlayers =  4;  //Max amount of players allowed to be registered to a match
const minPlayers =  2; //Min amount of players needed to trigger a match to start
const minReadyPlayers = 2; //min amount of players who have to be ready for a prematch timer to skip down to 5 seconds
const prematchTimerDefault = 30; //Amount of time (in seconds, so 20-ticks intervals) before a match starts once minPlayers has been satisfied. Defauls is 30
const roundTimerDefault = 15; //Amount of time (seconds) a round should last before it ends to time. Default is 120
const roundPrepTimerDefault = 12; //Amount of time players get for preparation, before the gates open and a round starts. Default is 20
const roundPostTimerDefault = 8; //Amount of time before round is ended and players get sent back to their appropriate Team Room, after the round has been won by a team. Default is 4
const winPoints = 3; 			//Number of rounds a team needs to win in order to win the whole match
const jailCoords = [7, 1, 22]; //XYZ - Points to the intended center of Jail (the room dead players go to for the rest of the round) AS RELATIVE TO killBlockCoords. NOT ABSOLUTE COORDS.ALSO, make sure it's not obstructed, test the spawn coords manually just in case

//Global variables for program operation. Do not touch, initalization-only
var prematchTimer = 30;
var isPrematchTimerTicking = false;
var primingRequired = false
var triggerRequired = false;
var triggeredAction = 0;
var primeRoundPhaseOne = false;
var primeRoundPhaseTwo = false;
var killBlockCoords = []; //A block 2 blocks East (positive X from the matchTicker block. The effective position of this block will be right unde Phaste Two Primer. The only block whose absolute coordinates are saved globally (automatically, wherever it is), used as a reference/home point for several in-world operations.

onEvent("command.registry", event => {
	const { commands: Commands, arguments: Arguments} = event;
	//var lifetimePlayers = event.server.persistentData.gunArenaLifetimePlayersCount;
	
	function addToLifetimePlayers(number){
		let data = event.server.persistentData.gunArenaLifetimePlayersCount
		event.server.persistentData.gunArenaLifetimePlayersCount = event.server.persistentData.gunArenaLifetimePlayersCount + number;
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
		let player = `{"PlayerNumber":"${playerNumber}","Name":"${playerName}","Team":"Random","Ready":false,"Kills":0,"Deaths":0}`;
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
			//Utils.server.tell("Blue team is: " + teamsPlayersCount().Blue + ". Red team is: " + teamsPlayersCount().Red)
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
	const playersStoredSpawn = () => {return event.server.persistentData.gunArenaplayersStoredSpawn};
	const resetPlayersStoredSpawn = () => {event.server.persistentData.gunArenaplayersStoredSpawn = []};
	
	const currentMatch = () => {return event.server.persistentData.gunArenaCurrentMatch};
	const resetCurrentMatch = () => {let m = `{"IsOngoing":false,"TotalTime":0,"RoundTimer":-1,"RoundNumber":0,"BluePoints":0,"RedPoints":0,"BluePlayers":0,"RedPlayers":0}`; event.server.persistentData.gunArenaCurrentMatch = {}; event.server.persistentData.gunArenaCurrentMatch = (JSON.parse(m));};
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
								
								addToLifetimePlayers(1);					
								//Utils.server.runCommand('data merge block ' + (posX + relPosX)+ ' ' + (posY + relPosY) + ' ' + (posZ + relPosZ) + ` {Items:[{Slot:0b,id:"create_things_and_misc:card", Count: 1b, tag:{Inscribed:"Vulpine Co. [stage1-valid]",display:{Name:'[{"text":"Gun Arena ID-${paddedId}","italic":false}]',Lore:['[{"text":"| CARD ID: ${paddedId} | STATUS: Valid Entry Ticket |","italic":false}]']},GunArenaOrigin:1b}}]}`)
								Utils.server.runCommand('data merge block ' + (posX + relPosX)+ ' ' + (posY + relPosY) + ' ' + (posZ + relPosZ) + ` {Items:[{Slot:0b,id:"create_things_and_misc:card", Count: 1b, tag:{Inscribed:"Vulpine Co. [stage1-valid]",display:{Name:'[{"text":"Gun Arena ID-${paddedId}","italic":false}]',Lore:['[{"text":"| CARD ID: ${paddedId} | STATUS: Valid Entry Ticket |","color":"aqua","italic":false}]']},GunArenaOrigin:1b}}]}`)
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
							if (entityData.stages.has('ga_registered_player')) {event.server.tell("Found a valid Card, but you are already registered!"); return 0;}
							if (currentPlayers().length >= maxPlayers) {event.server.tell("Found a valid Card, but player slots are full! Please wait until the next match."); return 0;}
							if (currentMatch().IsOngoing) {event.server.tell("Found a valid Card, but a match is currently underway! Please wait warmly until the next match."); return 0;}
							
							let nameString = entityData.getInventory().getItem(slot).getTag().display.Name // get display name of Card item
							let nameRegex = /(.")(,)/
							let nameIndex = nameString.search(nameRegex)
							let playerName = entityData.name.contents
							let stringifiedPlayerName = ""
							stringifiedPlayerName = stringifiedPlayerName + playerName;
							let modifiedName = nameString.substring(0, (nameIndex + 1)) + ` ${stringifiedPlayerName} ` + nameString.substring((nameIndex + 1))
							
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
					};
				};
				return 1
				})
			)
			.then(Commands.literal('stage-three')				
				.then(Commands.literal('init').executes(ctx => {
					let registeredPlayers = currentPlayers().size();
					if (registeredPlayers < minPlayers || isPrematchTimerTicking) {return 0;}
					Utils.server.tell("Check #2");
					prematchTimer = prematchTimerDefault;
					Utils.server.tell("Minimum amount of players are present. Match starting soon!");
					//Upon trigger, periodic checks to see if a match is viable; that is, two or more players are registered or whateve minPlayers is set to
					recursiveTimer();
					isPrematchTimerTicking = true;
					Utils.server.tell("Recursive Timer Started");
					function recursiveTimer(){
						
						if (readyPlayers() >= minReadyPlayers && prematchTimer > 5) {prematchTimer = 5;}
						if (prematchTimer <= 0) {
							if ((teamsPlayersCount().Blue <= 1 && teamsPlayersCount().Random < 1) || (teamsPlayersCount().Red <= 1 && teamsPlayersCount().Random < 1)) {
								prematchTimer = 5; Utils.server.tell("Cannot start match with an empty team. Try again.");
								event.server.scheduleInTicks(20, callback => {
									recursiveTimer();
								})
								return 0;								
							}
							Utils.server.tell("MATCH HAS STARTED");
							prematchTimer = prematchTimerDefault;
							isPrematchTimerTicking = false;
							changeReadyPlayers(0);
							let pos = ctx.source.position;
							Utils.server.runCommand(`setblock ${Math.floor(pos.x())} ${Math.floor(pos.y()) + 1} ${Math.floor(pos.z())} minecraft:redstone_block`);							
							return 1;
							}
							
						Utils.server.tell("Match starts in " + prematchTimer + " and there are " + readyPlayers() + " players ready");
						prematchTimer--;
						event.server.scheduleInTicks(20, callback => {
							recursiveTimer();
						})	
					}					
					return 1;
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
						
						for (let slot = 0; slot < (size); slot++) {
							let invSlotId = entityData.getInventory().getItem(slot).serializeNBT().id;		
							if (invSlotId == "create_things_and_misc:card") {
								//Utils.server.tell("SUCCESFULLY FOUND A CARD");
								let cardTag = entityData.getInventory().getItem(slot).getTag().Inscribed;
								if (cardTag == "Vulpine Co. [stage2-prematch]") {														
									switch (parseInt(arg1)) {
									case 1: if (blueTag()) {return 0;}
										Utils.server.tell('join-team blue team detected');
										addTag('ga_blue_team');
										Utils.server.runCommand(`execute as ${stringifiedPlayerName} run vps-gunarena functions assign-to-team ${arg1}`);
										changeTeamsPlayersCount(1 , 1);
										if (redTag()) {changeTeamsPlayersCount(-1 , 2); removeTag('ga_red_team');}
										if (randomTag()) {removeTag('ga_random_team'); changeTeamsPlayersCount(-1 , 3);}
										break;
									case 2: if (redTag()) {return 0;}
										Utils.server.tell('join-team red team detected');
										addTag('ga_red_team');
										Utils.server.runCommand(`execute as ${stringifiedPlayerName} run vps-gunarena functions assign-to-team ${arg1}`);
										changeTeamsPlayersCount(1 , 2);
										if (blueTag()) {changeTeamsPlayersCount(-1 , 1); removeTag('ga_blue_team');}
										if (randomTag()) {removeTag('ga_random_team'); changeTeamsPlayersCount(-1 , 3);}
										break;
									case 3: if (randomTag()) {return 0;}
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
						event.server.tell('Join team Command end');						
						return 1;
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
					  //Utils.server.tell("Array of random players: " + list);
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
														
														Utils.server.runCommand(`execute as @e[type=minecraft:player,tag=ga_blue_team] run vps-gunarena functions add-pipe-segment-finder "stage2" 3 "TEAM: Blue"`);
														Utils.server.runCommand(`execute as @e[type=minecraft:player,tag=ga_red_team] run vps-gunarena functions add-pipe-segment-finder "stage2" 3 "TEAM: Red"`);
														Utils.server.runCommand(`execute as @e[type=minecraft:player,tag=ga_registered_player] run vps-gunarena functions add-pipe-segment-finder "stage2" 4 "KILLS: 0"`);
														Utils.server.runCommand(`execute as @e[type=minecraft:player,tag=ga_registered_player] run vps-gunarena functions add-pipe-segment-finder "stage2" 5 "DEATHS: 0"`);
														Utils.server.runCommand(`execute as @e[type=minecraft:player,tag=ga_registered_player] run vps-gunarena functions mod-pipe-segment-finder "stage2" 6 "STATUS: In Match"`);

														//Activate Team Command blocks via redstone																												
														Utils.server.runCommand(`setblock ${posX + relXOne} ${posY + relYOne} ${posZ + relZOne} minecraft:redstone_block`);
														Utils.server.runCommand(`setblock ${posX + relXTwo} ${posY + relYTwo} ${posZ + relZTwo} minecraft:redstone_block`);
														Utils.server.runCommand(`execute as @e[type=minecraft:player,tag=ga_registered_player] run tag @s add ga_approved_entity`);
														Utils.server.runCommand(`setblock ${posX + relXThree} ${posY + relYThree} ${posZ + relZThree} minecraft:redstone_block`);
														//Utils.server.tell('init-match-begin');
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
				.then(Commands.literal('item-handler') //Individually stores player items for safekeeping during the match and to prevent foreign items from entering the Gun Arena
					.then(Commands.argument('rel-pos-x-one', Arguments.INTEGER.create(event))
						.then(Commands.argument('rel-pos-y-one', Arguments.INTEGER.create(event))
							.then(Commands.argument('rel-pos-z-one', Arguments.INTEGER.create(event))
								.executes(ctx => {
								const relXOne = Arguments.INTEGER.getResult(ctx, "rel-pos-x-one"); //EDIT These coords arguments will refer to the RELATIVE coords from the command block
								const relYOne = Arguments.INTEGER.getResult(ctx, "rel-pos-y-one"); //to the FIRST block that will be used for item safekeeping, where items will be teleported to, the "root" for the lockers area
								const relZOne = Arguments.INTEGER.getResult(ctx, "rel-pos-z-one"); //It is designed to have lockers 5 blocks apart from each other by default, going in the SOUTH (positive Z) direction in a straight line. The distance can be configured. Can build as many lockers as wished. Remember to change maxPlayers variable when expanding.
								
								const pos = ctx.source.position;
								let posX = Math.floor(pos.x());
								let posY = Math.floor(pos.y());
								let posZ = Math.floor(pos.z());
								
								for (let i =0; i < currentPlayers().length; i++) {									
									let pNumber = currentPlayers()[i].PlayerNumber;
									let pName = currentPlayers()[i].Name;
									let newInscribed = `Vulpine Co. [stage4-match-${pName}]`; //Will make the player's card work as a unique key to open the lockers during prematch and briefly after match ends so they can pick their stuff up
									let lockerArrayDist = 7 * (pNumber - 1) //EDIT This is the default distance between locker root to locker root (the block right above the chute, to where items get teleported
									
									//Each iteration is delayed by one extra tick in order to prevent interference in the form if player items getting mixed up
									event.server.scheduleInTicks((pNumber), callback => {
										Utils.server.runCommand(`execute as ${pName} run say hello I am player ${pNumber}`);
										Utils.server.runCommand(`execute as ${pName} run vps-gunarena functions drop-all`);
										
										//Curios slots need to be handled separately to regular inventory; luckily there is a handy `/curios drop` command 
										let curiosSlots = ["back", "belt", "feet", "hands", "head", "necklace"];			
										for (let i = 0; i < curiosSlots.length; i++) {				
											Utils.server.runCommand(`curios drop ${pName} ${curiosSlots[i]}`);
										}
										//perhaps add one tick per player number, to avoid any potential interference. Tags items (minus Gun Arena card) with Player # then teleports them for safekeeping
										event.server.scheduleInTicks(2, callback => {
											Utils.server.runCommand(`execute positioned as ${pName} as @e[type=item,distance=..3] unless data entity @s {Item:{tag:{GunArenaOrigin:1b}}} run data merge entity @s {Item:{tag:{belongsToPlayer:${pNumber}}}}`);
											Utils.server.runCommand(`tp @e[type=item,nbt={Item:{tag:{belongsToPlayer:${pNumber}}}}] ${posX + relXOne} ${posY + relYOne} ${posZ + relZOne + lockerArrayDist}`); //TP items to be picked up by custom locker for safekeeping. Create pipes are used for quickly catchign all the items. The defautl locker design was extensively tested and catches all items reliably.
											//Utils.server.runCommand(`execute positioned as ${pName} as @e[type=item,distance=..3,nbt={Item:{tag:{GunArenaOrigin:1b}}}] run data merge entity @s {Item:{tag:{Inscribed:"${newInscribed}"}}}`); //repurpose card as keycard and enhcance it with Recall and Soulbinding so it sticks well to players
											//Utils.server.runCommand(`execute positioned as ${pName} as @e[type=item,distance=..3,nbt={Item:{tag:{GunArenaOrigin:1b}}}] run data merge entity @s {Item:{tag:{Inscribed:"${newInscribed}",Enchantments:[{lvl:1s,id:"capsule:recall"}],tic_modifiers:[{level:1s,name:"tconstruct:soulbound"},{level:1s,name:"tconstruct:resurrected"}],tic_persistent_data:{upgrades:-1},tic_stats:{},tic_upgrades:[{level:1s,name:"tconstruct:resurrected"},{level:1s,name:"tconstruct:soulbound"}],tic_volatile_data:{upgrades:1}}}}`); //backup of line
											Utils.server.runCommand(`execute positioned as ${pName} as @e[type=item,distance=..3,nbt={Item:{tag:{GunArenaOrigin:1b}}}] run data merge entity @s {Item:{tag:{Inscribed:"${newInscribed}",Enchantments:[{lvl:1s,id:"capsule:recall"}],tic_modifiers:[{level:1s,name:"tconstruct:soulbound"},{level:1s,name:"tconstruct:resurrected"}],tic_persistent_data:{upgrades:-1},tic_stats:{},tic_upgrades:[{level:1s,name:"tconstruct:resurrected"},{level:1s,name:"tconstruct:soulbound"}],tic_volatile_data:{upgrades:1}}},PickupDelay:0s}`);
											Utils.server.runCommand(`execute positioned as ${pName} as @e[type=item,distance=..3,nbt={Item:{tag:{GunArenaOrigin:1b}}}] run tp @s ~ ~ ~`);
											Utils.server.runCommand(`execute positioned ${posX + relXOne + 2} ${posY + relYOne - 1} ${posZ + relZOne - 3 + lockerArrayDist} run data merge block ~ ~ ~ {ForgeData:{check:"${newInscribed}"}}`); // Actually modify the lock so it works with the new keycard. Coords of position are relative to the relative coords. All lockers should be the exact same design and distance
											Utils.server.runCommand(`execute positioned ${posX + relXOne + 5} ${posY + relYOne - 2} ${posZ + relZOne - 2 + lockerArrayDist} run data merge block ~ ~ ~ {ForgeData:{check:"${newInscribed}"}}`); // Outer lock (door) mainly just for fun. Not essential.
										})
									})
									
								}
								
								return 1
								})
							)
						)
					)
				)		
				.then(Commands.literal('start-match-ticker') //Triggers main game loop which handles the round, events, resets
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
								
								killBlockCoords = [parseInt(posX + 2), parseInt(posY), parseInt(posZ)]; //This sets the relative coordinates to Phase two primer, (round ender) which is triggered by entity.death event in order to save resources/prevent additional checks in loop								
								
								let jailX = killBlockCoords[0] + jailCoords[0];
								let jailY = killBlockCoords[1] + jailCoords[1];
								let jailZ = killBlockCoords[2] + jailCoords[2];
								
								Utils.server.tell(`Jail coords are = ` + jailX + " " + jailY + " " + jailZ);
								
								//Store player spawn coords then set their current ones to Jail (as defined by relative coords of killBlockCoords
								Utils.server.runCommand(`vps-gunarena functions store-player-spawns`);
								for (let i = 0; i < currentPlayers().length; i++) {
									Utils.server.runCommand(`execute as ${currentPlayers()[i].Name} run spawnpoint @s ${jailX} ${jailY} ${jailZ}`);
								}
								
								event.server.persistentData.gunArenaCurrentMatch.IsOngoing = true; //Set flag that match is underway. Game loop stops if this flag is false
								event.server.persistentData.gunArenaCurrentMatch.BluePlayers = teamsPlayersCount().Blue; //teamsPlayersCount is doubling as a cached count of players that will be used to actually keep track
								event.server.persistentData.gunArenaCurrentMatch.RedPlayers = teamsPlayersCount().Red;   //of who the winning team of a round is by being subtracted whenever a player of that team is killed
								matchTicker();
								redstoneBlock(1, 0, 0);
								
								//Main game loop of GunArena that handles events throughout a live match
								function matchTicker () {
									if (!currentMatch().IsOngoing) {return 0;}
									addToCurrentMatchTime(1);
									Utils.server.tell("Match ticking. Total match time is: " + currentMatch().TotalTime); 
									/*if (currentMatch().TotalTime == internalTimerOne) {
										internalTimerOne = getTimeToNextAction(roundTimerDefault, 0); //The offset is canceled here because it is not needed for inner timers set from outside the function
										Utils.server.tell("Internal timer triggered!");
									}*/									
									
									if (currentMatch().RoundTimer > -1) {currentMatch().RoundTimer += -1;}
									Utils.server.tell("Round Timer is: " + currentMatch().RoundTimer);
									if (currentMatch().RoundTimer == 0) { //Natural subloop to handle round timers
										redstoneBlock(2, 0, 1); //Trigger Phase two (reset players and close the gates)
										switch (true) {
											case (currentMatch().BluePlayers < currentMatch().RedPlayers):
												currentMatch().RedPoints += 1;
												Utils.server.runCommand(`setblock ${killBlockCoords[0]} ${killBlockCoords[1]} ${killBlockCoords[2]} minecraft:redstone_block`);												
												break;
											case (currentMatch().RedPlayers < currentMatch().BluePlayers):
												currentMatch().BluePoints += 1;
												Utils.server.runCommand(`setblock ${killBlockCoords[0]} ${killBlockCoords[1]} ${killBlockCoords[2]} minecraft:redstone_block`);												
												break;					
										}
										
										switch (true) {
											case (currentMatch().BluePoints == winPoints):
												Utils.server.tell("Blue Team has Won the Match")
												redstoneBlock(3, 0, 0);
												break;
											case (currentMatch().RedPoints == winPoints):
												Utils.server.tell("Red Team has Won the Match")
												redstoneBlock(3, 0, 0);												
												break;					
										}
										Utils.server.tell("ROUND ENDED FROM TIME!");
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
											case primeRoundPhaseTwo:
												nextTrigger = getTimeToNextAction(roundPostTimerDefault, -2); 
												Utils.server.tell("Round Phase Two Primed");
												primingRequired = false;
												primeRoundPhaseTwo = false
												triggerRequired = true;
												triggeredAction = 2;
												break;
										}
									}
									
									if (triggerRequired && currentMatch().TotalTime == nextTrigger) {
										switch (triggeredAction) {
											case 1: //Trigger Phase one (open the gates)
												redstoneBlock(1, 0, 1);
												break;
											case 2: //Trigger Phase two (reset players and close the gates)
												redstoneBlock(2, 0, 1);
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
					.then(Commands.literal('phase-one') //Time till gates open, pre-round start
						.then(Commands.literal('primer') //Prime the main game loop to do the trigger after x seconds, where x is roundPrepTimerDefault
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
						.then(Commands.literal('trigger') //Actually do the stuff - OPEN DA GATES
							.then(Commands.argument('rel-pos-x-one', Arguments.INTEGER.create(event))
								.then(Commands.argument('rel-pos-y-one', Arguments.INTEGER.create(event))
									.then(Commands.argument('rel-pos-z-one', Arguments.INTEGER.create(event))
										.then(Commands.argument('rel-pos-x-two', Arguments.INTEGER.create(event))
											.then(Commands.argument('rel-pos-y-two', Arguments.INTEGER.create(event))
												.then(Commands.argument('rel-pos-z-two', Arguments.INTEGER.create(event))
													.executes(ctx => {
														const relXOne = Arguments.INTEGER.getResult(ctx, "rel-pos-x-one"); //EDIT IN COMMAND BLOCK Relative coords to blue Team Room gate activator, such as to place a redstone block
														const relYOne = Arguments.INTEGER.getResult(ctx, "rel-pos-y-one");
														const relZOne = Arguments.INTEGER.getResult(ctx, "rel-pos-z-one");
														const relXTwo = Arguments.INTEGER.getResult(ctx, "rel-pos-x-two"); //Relative coords to blue Team Room gate activator
														const relYTwo = Arguments.INTEGER.getResult(ctx, "rel-pos-y-two");
														const relZTwo = Arguments.INTEGER.getResult(ctx, "rel-pos-z-two");

														const redstoneBlock = (relX, relY, relZ) => {Utils.server.runCommand(`setblock ${posX + relX} ${posY + relY} ${posZ + relZ} minecraft:redstone_block`)};
														
														const pos = ctx.source.position;
														let posX = Math.floor(pos.x());
														let posY = Math.floor(pos.y());
														let posZ = Math.floor(pos.z());
														
														Utils.server.runCommand(`setblock ${posX} ${posY - 1} ${posZ} minecraft:air`);																									
														Utils.server.runCommand(`setblock ${posX + relXOne} ${posY + relYOne} ${posZ + relZOne} minecraft:redstone_block`); //Open Blue Team Gates
														Utils.server.runCommand(`setblock ${posX + relXTwo} ${posY + relYTwo} ${posZ + relZTwo} minecraft:redstone_block`); //Open Red Team Gates
														
														currentMatch().RoundTimer = roundTimerDefault;																																										
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
					.then(Commands.literal('phase-two') //Close gates and resend players to their Team Rooms
						.then(Commands.literal('primer') //Prime the main game loop to do the trigger after x seconds, where x is roundPostTimerDefault
							.executes(ctx => {
								const pos = ctx.source.position;
								let posX = Math.floor(pos.x());
								let posY = Math.floor(pos.y());
								let posZ = Math.floor(pos.z());
								
								Utils.server.runCommand(`setblock ${posX} ${posY - 1} ${posZ} minecraft:air`);
								primingRequired = true;
								primeRoundPhaseTwo = true;
								return 1
							})
						)
						.then(Commands.literal('trigger')
							.then(Commands.argument('rel-pos-x-one', Arguments.INTEGER.create(event))
								.then(Commands.argument('rel-pos-y-one', Arguments.INTEGER.create(event))
									.then(Commands.argument('rel-pos-z-one', Arguments.INTEGER.create(event))
										.then(Commands.argument('rel-pos-x-two', Arguments.INTEGER.create(event))
											.then(Commands.argument('rel-pos-y-two', Arguments.INTEGER.create(event))
												.then(Commands.argument('rel-pos-z-two', Arguments.INTEGER.create(event))
													.executes(ctx => {
														const relXOne = Arguments.INTEGER.getResult(ctx, "rel-pos-x-one"); //EDIT IN COMMAND BLOCK Relative coords to blue Team Room gate activator
														const relYOne = Arguments.INTEGER.getResult(ctx, "rel-pos-y-one");
														const relZOne = Arguments.INTEGER.getResult(ctx, "rel-pos-z-one");
														const relXTwo = Arguments.INTEGER.getResult(ctx, "rel-pos-x-two"); //Relative coords to blue Team Room gate activator
														const relYTwo = Arguments.INTEGER.getResult(ctx, "rel-pos-y-two");
														const relZTwo = Arguments.INTEGER.getResult(ctx, "rel-pos-z-two");

														const redstoneBlock = (relX, relY, relZ) => {Utils.server.runCommand(`setblock ${posX + relX} ${posY + relY} ${posZ + relZ} minecraft:redstone_block`)};
														
														const pos = ctx.source.position;
														let posX = Math.floor(pos.x());
														let posY = Math.floor(pos.y());
														let posZ = Math.floor(pos.z());
														
														Utils.server.runCommand(`setblock ${posX} ${posY - 1} ${posZ} minecraft:air`);																									
														Utils.server.runCommand(`setblock ${posX + relXOne} ${posY + relYOne} ${posZ + relZOne} minecraft:air`); //CLOSE the gates
														Utils.server.runCommand(`setblock ${posX + relXTwo} ${posY + relYTwo} ${posZ + relZTwo} minecraft:air`);
														
														Utils.server.runCommand(`setblock ${posX + relXOne + 4} ${posY + relYOne - 5} ${posZ + relZOne} minecraft:redstone_block`); //EDIT Make this the relative coords going from gate activator to the bottom of the block at the center of each Team Room with the players-summon command
														Utils.server.runCommand(`setblock ${posX + relXTwo + -4} ${posY + relYTwo - 5} ${posZ + relZTwo} minecraft:redstone_block`); //This sends players to their respective Team Rooms. First one is Blue, then Red.
														currentMatch().RoundNumber += 1;
														
														event.server.persistentData.gunArenaCurrentMatch.BluePlayers = teamsPlayersCount().Blue; //reset teamsPlayersCount VERY IMPORTANT
														event.server.persistentData.gunArenaCurrentMatch.RedPlayers = teamsPlayersCount().Red;
														
														Utils.server.runCommand(`setblock ${posX + relXOne + -14} ${posY + relYOne - 3} ${posZ + relZOne - 10} minecraft:redstone_block`) //Prime Phase One and keep the Round loop going until game ends. Coord goes from  Blue gate activation block.

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
				.then(Commands.literal('conclude-match')
					.executes(ctx => {						
						const pos = ctx.source.position;
						let posX = Math.floor(pos.x());
						let posY = Math.floor(pos.y());
						let posZ = Math.floor(pos.z());
						
						let matchSeconds = currentMatch().TotalTime % 60;
						let matchMinutes = (currentMatch().TotalTime - matchSeconds) / 60;
						let bluePoints = currentMatch().BluePoints;
						let redPoints = currentMatch().RedPoints;
						let blueResultMsg = "";
						let redResultMsg = "";
						
						function getTeamKillsorDeaths (team, killsOrDeaths) {
						  let count = 0;
						   for (let i = 0; i < currentPlayers().length; i++) {
							  
							  if (currentPlayers()[i].Team == team) {
								//console.log(currentPlayers()[i].Team);
								count += currentPlayers()[i][killsOrDeaths];
							  }
						  }
						  return count;
						}
						
						//By simply comparing points, this is able to handle premature match conclussion, ending the game and properly declaring a winner with whatever the current state of the game was
						switch (true) {
							case (bluePoints > redPoints):
								blueResultMsg = "Victory";
								redResultMsg = "Defeat";
								break;
							case (redPoints > bluePoints):
								blueResultMsg = "Defeat";
								redResultMsg = "Victory";
								break;
							case (bluePoints == redPoints):
								blueResultMsg = "Tie";
								redResultMsg = "Tie";
								break;
						}
						
						//toadd Team K/D - ${}/${},
						//Write final match result into players' cards
						//The 2-tick delay is used because otherwise if a player dies and it causes the game to end, their card won't get written
						event.server.scheduleInTicks(2, callback => {
						Utils.server.runCommand(`execute as @e[type=minecraft:player,tag=ga_blue_team] run vps-gunarena functions mod-pipe-segment-finder "stage4" 6 "STATUS: ${blueResultMsg} - Team Kills: ${getTeamKillsorDeaths("Blue", "Kills")} / Deaths: ${getTeamKillsorDeaths("Blue", "Deaths")} - Rounds Won: ${bluePoints} / Lost: ${redPoints} - Match Time: ${matchMinutes.toString().padStart(5,0)}:${matchSeconds}"`);
						Utils.server.runCommand(`execute as @e[type=minecraft:player,tag=ga_red_team] run vps-gunarena functions mod-pipe-segment-finder "stage4" 6 "STATUS: ${redResultMsg} - Team Kills: ${getTeamKillsorDeaths("Red", "Kills")} / Deaths: ${getTeamKillsorDeaths("Red", "Deaths")} - Rounds Won: ${redPoints} / Lost: ${bluePoints} - Match Time: ${matchMinutes}:${matchSeconds}"`);
						})
						
						
						Utils.server.runCommand(`setblock ${posX} ${posY - 1} ${posZ} minecraft:air`); //Remove redstone block from matchTicker + repeat command block corner
						
						Utils.server.runCommand(`setblock ${killBlockCoords[0] - 3} ${killBlockCoords[1]} ${killBlockCoords[2]} minecraft:air`); //Uses killBlockCoords (two blocks south, or Positive Z, to matchTicker command block) to clear the redstone block underneath command block
						Utils.server.runCommand(`setblock ${killBlockCoords[0] + 13} ${killBlockCoords[1] + 3} ${killBlockCoords[2] + 10} minecraft:air`); //EDIT uses killBlockCoords to close gate of Blue Team Room if needed
						Utils.server.runCommand(`setblock ${killBlockCoords[0] + 1} ${killBlockCoords[1] + 3} ${killBlockCoords[2] + 10} minecraft:air`); //same but for Red Team Room
						
						//tag removal, delayed by 2 ticks so other operations can be done before tags and data are gone
						//then clears various persistent data used for match
						event.server.scheduleInTicks(4, callback => {
							let tagArr = ["ga_registered_player","ga_approved_entity","ga_blue_team","ga_red_team"]
							for (let i = 0; i < tagArr.length; i++) {							
								Utils.server.runCommand(`tag @e[type=minecraft:player,tag=${tagArr[i]}] remove ${tagArr[i]}`);
							}
							
							initializeCurrentPlayers(0, 1);
							resetPlayersStoredSpawn(); //ONLY AFTER GIVING THEM BACK THEIR SPAWN LMAO
							changeReadyPlayers(0);
							changeTeamsPlayersCount(1, 0);
							resetCurrentMatch();
							
							primingRequired = false
							triggerRequired = false;
							triggeredAction = 0;
							primeRoundPhaseOne = false;
							primeRoundPhaseTwo = false;
						})
						
						Utils.server.runCommand(`vps-gunarena functions return-player-spawns`); //Gives players their spawn points back
						
						return 1
					})
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
				.then(Commands.literal('init-persistent-data') //initalizes (and resets) all persistent server data related to GunArena, for debugging as well as first-time setup. Run this at least once when first setting up the Gun Arena
					.executes(ctx => {						
						resetLifetimePlayers();
						resetPlayersStoredSpawn();
						initializeCurrentPlayers(0, 1);
						changeTeamsPlayersCount(1, 0);
						changeReadyPlayers(0);						
						resetCurrentMatch(0);																														
						
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
				.then(Commands.literal('mod-pipe-segment-finder') //same as mod-pipe-segment, but this one includes a finder loop to grab the card of the player on the go, wherever it is in the inventory
					.then(Commands.argument('inscribed', Arguments.STRING.create(event))
						.then(Commands.argument('pipe-index', Arguments.INTEGER.create(event))
							.then(Commands.argument('new-lore', Arguments.STRING.create(event))
								.executes(ctx => {
									const arg1 = Arguments.STRING.getResult(ctx, "inscribed")
									const arg2 = Arguments.INTEGER.getResult(ctx, "pipe-index")								
									const arg3 = Arguments.STRING.getResult(ctx, "new-lore")
									
									let entityData = ctx.source.entity;
									let size = entityData.getInventory().containerSize;
									Utils.server.tell("Size is: " + size);
									for (let slot = 0; slot < (size); slot++) {
										let invSlotId = entityData.getInventory().getItem(slot).serializeNBT().id; //get ID from NBT of item
										if (invSlotId == "create_things_and_misc:card") {									
											let cardTag = entityData.getInventory().getItem(slot).getTag().Inscribed; //get the NBT dat adown to the Inscribed key for validation
											
											if (cardTag.includes(arg1)) {
												modPipeSegment(slot, arg2, arg3);
												break;
											} else {continue};
										};
									};	

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
				.then(Commands.literal('add-pipe-segment-finder')
					.then(Commands.argument('inscribed', Arguments.STRING.create(event))
						.then(Commands.argument('pipe-index', Arguments.INTEGER.create(event))
							.then(Commands.argument('new-lore', Arguments.STRING.create(event))
								.executes(ctx => {
									const arg1 = Arguments.STRING.getResult(ctx, "inscribed")
									const arg2 = Arguments.INTEGER.getResult(ctx, "pipe-index")								
									const arg3 = Arguments.STRING.getResult(ctx, "new-lore")
									
									let entityData = ctx.source.entity;
									let size = entityData.getInventory().containerSize;
									Utils.server.tell("Size is: " + size);
									for (let slot = 0; slot < (size); slot++) {
										let invSlotId = entityData.getInventory().getItem(slot).serializeNBT().id; //get ID from NBT of item
										if (invSlotId == "create_things_and_misc:card") {									
											let cardTag = entityData.getInventory().getItem(slot).getTag().Inscribed; //get the NBT dat adown to the Inscribed key for validation
											
											if (cardTag.includes(arg1)) {
												modPipeSegment(slot, arg2, arg3);
												break;
											} else {continue};
										};
									};	
									
									
									function modPipeSegment (slot, pipeIndex, newLore) {
										let entityData = ctx.source.entity
										const getLore = () => {return String.raw`${entityData.getInventory().getItem(slot).getTag().display.Lore}`;}
										const modifyLore = (p) => {entityData.getInventory().getItem(slot).getTag().display.Lore = eval(p);}
										const buildRegex = (i) => {return RegExp(String.raw`((?:.*?\|){${i}}).*$`);}
										let stringStartIndex = getLore().match(buildRegex(pipeIndex))[1].length;
										let stringEndIndex = stringStartIndex - 1;
										let modifiedLore = getLore().substring(0, (stringStartIndex + 1)) + newLore + ' ' + getLore().substring((stringEndIndex ))
										modifyLore(modifiedLore);
										
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
							for (let slot = 0; slot < (size); slot++) {
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
				.then(Commands.literal('reset-currentMatch') //Drop all items in (vanilla) inventory of entity who ran this command; used in item-handler
					.executes(ctx => {
						resetCurrentMatch();
						Utils.server.tell("Full obj: " + currentMatch());
						return 1
					})
				)
				.then(Commands.literal('drop-all') //Drop all items in (vanilla) inventory of entity who ran this command; used in item-handler
					.executes(ctx => {
						let entityData = ctx.source.entity;
						entityData.inventory.dropAll();
						return 1
					})
				)
				.then(Commands.literal('store-player-spawns') //Used as part of death-handler. Stores spawn coords (beds or whatever) of registered players to give them back after match, since player spawn point is changed to Jail during.
					.executes(ctx => {												
						for (let i = 0; i < currentPlayers().length; i++) {
							Utils.server.runCommand(`execute as ${currentPlayers()[i].Name} run vps-gunarena functions fetch-spawn`);
						}						
						return 1
					})
				)
				.then(Commands.literal('fetch-spawn') //called by store-player-spawns and executed as and per player, actually builds the compound tag array
					.executes(ctx => {						
						let getCoord = ctx.source.entity.getRespawnPosition();		
						let spawnX = getCoord.getX();
						let spawnY = getCoord.getY();
						let spawnZ = getCoord.getZ();																							
						let spawnData = `{"Name":"${ctx.source.entity.name.contents}","X":${spawnX},"Y":${spawnY},"Z":${spawnZ}}`;
						
						event.server.persistentData.gunArenaplayersStoredSpawn.push(JSON.parse(spawnData));
						Utils.server.tell("Array is now : " + playersStoredSpawn());						
						return 1
					})
				)
				.then(Commands.literal('return-player-spawns') //Used as part of death-handler. Gives back spawn coords of registered players after match
					.executes(ctx => {												
						for (let i = 0; i < currentPlayers().length; i++) {
							let sX = playersStoredSpawn()[i].X;
							let sY = playersStoredSpawn()[i].Y;
							let sZ = playersStoredSpawn()[i].Z;
							
							Utils.server.runCommand(`execute as ${currentPlayers()[i].Name} run spawnpoint @s ${sX} ${sY} ${sZ}`);
						}						
						return 1
					})
				)
		)
		.then(Commands.literal('extras') //Unnecessary yet satisfying features, polish, bells and whistles
			.then(Commands.literal('shop') //Simple drop-and-buy shop command, meant to be used with a tileable shop build template
				.then(Commands.argument('sale-item', Arguments.STRING.create(event))
					.then(Commands.argument('payment-item', Arguments.STRING.create(event))
						.then(Commands.argument('item-price', Arguments.INTEGER.create(event))
							.executes(ctx => {
								const saleItem = Arguments.STRING.getResult(ctx, "sale-item");
								const paymentItem = Arguments.STRING.getResult(ctx, "payment-item");
								const itemPrice = Arguments.INTEGER.getResult(ctx, "item-price");
								
								const pos = ctx.source.position
								let posX = Math.floor(pos.x());
								let posY = Math.floor(pos.y());
								let posZ = Math.floor(pos.z());								
							
								let itemCount = Utils.server.runCommand(`data get block ${posX - 1} ${posY} ${posZ + 1} Items[0].Count`);								
								
								if (itemCount >= itemPrice) {
								Utils.server.runCommand(`data merge block ${posX - 1} ${posY} ${posZ + 1} {Items:[{Slot:0b,id:"${paymentItem}",Count:${itemCount - itemPrice}b}]}`);								
								Utils.server.runCommand(`summon minecraft:item ${posX - 1} ${posY + 7} ${posZ + 1} {Item:{id:"${saleItem}",Count:1b}}`);
								}
								
								return 1
							})
						)
					)
				)
			)
			.then(Commands.literal('shop-ticket') //Simple drop-and-buy shop command, specialized for tickets				
				.then(Commands.argument('payment-item', Arguments.STRING.create(event))
					.then(Commands.argument('item-price', Arguments.INTEGER.create(event))
						.executes(ctx => {							
							const paymentItem = Arguments.STRING.getResult(ctx, "payment-item");
							const itemPrice = Arguments.INTEGER.getResult(ctx, "item-price");
							
							const pos = ctx.source.position
							let posX = Math.floor(pos.x());
							let posY = Math.floor(pos.y());
							let posZ = Math.floor(pos.z());								
							let paddedId = lifetimePlayersCount().toString().padStart(5,0);
							let itemCount = Utils.server.runCommand(`data get block ${posX - 1} ${posY} ${posZ + 1} Items[0].Count`);
							
							if (itemCount >= itemPrice) {
							Utils.server.runCommand(`data merge block ${posX - 1} ${posY} ${posZ + 1} {Items:[{Slot:0b,id:"${paymentItem}",Count:${itemCount - itemPrice}b}]}`);														
							Utils.server.runCommand(`summon minecraft:item ${posX - 1} ${posY + 7} ${posZ + 1} {Item:{id:"create_things_and_misc:card",Count:1b,tag:{Inscribed:"Vulpine Co. [stage1-valid]",display:{Name:'[{"text":"Gun Arena ID-${paddedId}","italic":false}]',Lore:['[{"text":"| CARD ID: ${paddedId} | STATUS: Valid Entry Ticket |","color":"aqua","italic":false}]']},GunArenaOrigin:1b}}}`);
							addToLifetimePlayers(1)
							}							
							return 1
						})
					)
				)
				
			)
			.then(Commands.literal('test')
				.executes(ctx => {
					Utils.server.tell("000000")
					return 1
				})
			)
		)			
		.then(Commands.literal('test')				
			.executes(ctx => {
				Utils.server.tell("test command for match timer")
				let entityData = ctx.source.entity;			
				//Utils.server.tell("teamsPlayersCount is: " + teamsPlayersCount())									
				//let playerName = entityData.name.contents
				//let stringifiedPlayerName = ""
				//stringifiedPlayerName = stringifiedPlayerName + playerName;
				
				
				
				Utils.server.tell("Blue Players: " + currentMatch().BluePlayers);
				Utils.server.tell("Red Players: " + currentMatch().RedPlayers);
				Utils.server.tell("Blue Points: " + currentMatch().BluePoints);
				Utils.server.tell("Red Points: " + currentMatch().RedPoints);
				let paddedId = "meow";
				Utils.server.runCommand(`summon minecraft:item 10 -60 33 {Item:{id:"create_things_and_misc:card",Count:1b,tag:{Inscribed:"Vulpine Co. [stage1-valid]",display:{Name:'[{"text":"Gun Arena ID-${paddedId}","italic":false}]',Lore:['[{"text":"| CARD ID: ${paddedId} | STATUS: Valid Entry Ticket |","color":"aqua","italic":false}]']},GunArenaOrigin:1b}}}`);
				
				/*
				for (let i = 0; i < currentPlayers().length; i++) {
					let sX = playersStoredSpawn()[i].X;
					let sY = playersStoredSpawn()[i].Y;
					let sZ = playersStoredSpawn()[i].Z;
					
					Utils.server.runCommand(`execute as ${currentPlayers()[i].Name} run spawnpoint @s ${sX} ${sY} ${sZ}`);
				}
				
				
				Utils.server.tell("My spawn Point: " + entityData.getRespawnPosition().getX());
				Utils.server.tell("My spawn keys: " + Object.keys(entityData.getRespawnPosition()))
				Utils.server.tell("My spawn typeof: " + typeof(entityData.getRespawnPosition()))				
				Utils.server.tell("SPAWN ARRAY IS: " + playersStoredSpawn());
				*/								
				
				return 1
			})	
		)		
		.then(Commands.literal('test-addplayers')
			.executes(ctx => {
			Utils.server.tell("test command for match timer")
			let entityData = ctx.source.entity;						
			//Utils.server.tell("teamsPlayersCount is: " + teamsPlayersCount())									
			let playerName = entityData.name.contents
			let stringifiedPlayerName = ""
			//stringifiedPlayerName = stringifiedPlayerName + playerName;
			
			currentMatch().BluePlayers += 1;
			currentMatch().RedPlayers += 1;
			
			Utils.server.tell("Blue Players: " + currentMatch().BluePlayers);
			Utils.server.tell("Red Players: " + currentMatch().RedPlayers);												
			return 1
			})			
		)
		.then(Commands.literal('BLANK').executes(ctx => {
			resetCurrentMatch()
			//Add code here
			//For copy-pasting purposes
			//KEEP RETURN
			return 1
			})
		)
	)  	
})

//death cannot be canceled. on death, some global variables are affected, and spawnpoint is set
onEvent("entity.death", event => {
	
	const currentMatch = () => {return event.server.persistentData.gunArenaCurrentMatch}; //sadly some of these have to be repeated per event as I can't figure out how to make them global
	const currentPlayers = () => {return event.server.persistentData.gunArenaCurrentPlayers};
	const tag = (p) => {return event.entity.stages.has(p)};

	//Utils.server.tell("Deathee is " + event.entity.stages.has('ga_registered_player'));
	
	function KDChanger (pName, killOrDeath) {		
		const currentPlayers = () => {return event.server.persistentData.gunArenaCurrentPlayers};

		for (let i = 0; i < currentPlayers().length; i++) {
			
			if (pName == currentPlayers()[i].Name) {				
				switch (killOrDeath) {
					case 1: //Add a kill
						currentPlayers()[i].Kills += 1;						
						Utils.server.runCommand(`execute as ${pName} run vps-gunarena functions mod-pipe-segment-finder "stage4" 4 "KILLS: ${currentPlayers()[i].Kills}"`);
						break;
					case 2: //Add a death
						currentPlayers()[i].Deaths += 1;						
						Utils.server.runCommand(`execute as ${pName} run vps-gunarena functions mod-pipe-segment-finder "stage4" 5 "DEATHS: ${currentPlayers()[i].Deaths}"`);
						break;
				}
			}			
		}
	}
	
	//if (!currentMatch().IsOngoing) {return;}
	
	if (event.entity.type == "minecraft:polar_bear") {

			if (event.source.player) { //check if sourcce is a player
				let pSource = event.source.player.name.contents;
				Utils.server.tell("Source is a player");
				Utils.server.tell("Source: " + (pSource));
				KDChanger(pSource, 1);
				
			} else {Utils.server.tell("Source is " + event.source);}
			//Utils.server.tell("Keys of death event: " + Object.keys(event.source.player.name));
	}
	
	if (event.entity.type == "minecraft:player" && tag('ga_registered_player')) {	
		let deadPlayerName = event.entity.name.contents; //Get the deathee's name (this comment only exists so I can say the word Deathee)
		
			Utils.server.tell(`Player ${deadPlayerName} is ded`)
			Utils.server.runCommand(`gamerule doImmediateRespawn true`);
			
			event.server.scheduleInTicks(2, callback => {
				Utils.server.runCommand(`gamerule doImmediateRespawn false`);			
			})
			
			event.server.scheduleInTicks(10, callback => {
				Utils.server.tell("Changed deaths, and is now: " + currentPlayers()[1].Deaths);
				KDChanger(deadPlayerName, 2);
			})

			/*
			if (tag("ga_approved_entity")) {
				Utils.server.runCommand(`gamerule doImmediateRespawn true`);
				event.server.scheduleInTicks(2, callback => {
					Utils.server.runCommand(`gamerule doImmediateRespawn false`);
				})
			}*/
			//Utils.server.runCommand(`gamerule doImmediateRespawn false`);
			switch (true) {
				case tag("ga_blue_team"):
					Utils.server.tell("Blue Player Killed!");
					currentMatch().BluePlayers += -1;
					break;
				case tag("ga_red_team"):
					Utils.server.tell("Red Player Killed!");
					currentMatch().RedPlayers += -1;
					break;
			}
			
			switch (true) {
				case (currentMatch().BluePlayers == 0):
					currentMatch().RedPoints += 1;
					Utils.server.runCommand(`setblock ${killBlockCoords[0]} ${killBlockCoords[1]} ${killBlockCoords[2]} minecraft:redstone_block`);
					//redstone
					break;
				case (currentMatch().RedPlayers == 0):
					currentMatch().BluePoints += 1;
					Utils.server.runCommand(`setblock ${killBlockCoords[0]} ${killBlockCoords[1]} ${killBlockCoords[2]} minecraft:redstone_block`);
					//redstone
					break;					
			}
			
			switch (true) {
				case (currentMatch().BluePoints == winPoints):
					Utils.server.tell("Blue Team has Won the Match")
					Utils.server.runCommand(`setblock ${killBlockCoords[0] + 1} ${killBlockCoords[1]} ${killBlockCoords[2]} minecraft:redstone_block`);
					break;
				case (currentMatch().RedPoints == winPoints):					
					Utils.server.tell("Red Team has Won the Match")
					Utils.server.runCommand(`setblock ${killBlockCoords[0] + 1} ${killBlockCoords[1]} ${killBlockCoords[2]} minecraft:redstone_block`);
					break;					
			}			
	}	
	
	
})

onEvent('item.tags', event => {
	event.add('tconstruct:modifiable', 'create_things_and_misc:card')
})


onEvent('item.entity_interact', event => {
	const teamsPlayersCount = () => {return event.server.persistentData.gunArenaTeamsPlayersCount};
	
	if (event.target.type != "minecraft:fox" || event.item.id != "minecraft:redstone_block") return
	
	
	
	//Utils.server.tell("Triggered");
	//Utils.server.tell(Item.of(event.player.inventory.get(0).item.id))
	Utils.server.tell("Fox Clicked")
	
	
	//Utils.server.tell("Value of prematchTimer = " + prematchTimer);
	//Utils.server.tell("Type of prematchTimer = " + typeof(prematchTimer));
	
	//Utils.server.tell("Value of minPlayers = " + minPlayers + " " + prematchTimerDefault + " " + prematchTimer + " " + isPrematchTimerTicking);
	Utils.server.tell("teamsPlayersCount = " + teamsPlayersCount());
	if (teamsPlayersCount().Random == 1) {
			Utils.server.tell("Passed");
	}
	
	//Utils.server.tell("Type of readyPlayers = " + typeof(readyPlayers()));
	
	
	/*Utils.server.tell( event.player.stages.has('starting_items'))
	event.player.stages.remove('starting_items')
	Utils.server.tell(event.player.stages.has('starting_items'))*/
	
	//Utils.server.tell(event.item.name)
	
	
	
	//event.player.inventory.removeItem(!nonCapsule)
})

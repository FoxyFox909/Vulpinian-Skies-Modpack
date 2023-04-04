
const maxPlayers =  4  //Max amount of players allowed to be registered to a match
const minPlayers =  2  //Min amount of players needed to trigger a match
const prematchTimerDefault = 30 //Default time (in 20-ticks intervals, meaning seconds) before a match starts once minPlayers has been satisfied

//Variables for code operations, do not touch
var prematchTimer = 30
var isPrematchTimerTicking = false

onEvent('item.entity_interact', event => {
	
	if (event.target.type == "minecraft:fox" & event.item.id == "minecraft:nether_star"){
	
	
	var lifetimePlayers = event.server.persistentData.gunArenaLifetimePlayersCount;
	//const addToLifetimePlayers = event.server.persistentData.gunArenaLifetimePlayersCount++
	let paddedId = lifetimePlayers.toString().padStart(5,0)
	
	
	Utils.server.tell("Fox Clicked")
	Utils.server.tell("lifetimePlayers is " + lifetimePlayers)
	Utils.server.tell("If we strifigy and pad lifetimePlayers, it is " + paddedId)
	
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
	//addToLifetimePlayers(1)
	event.server.persistentData.gunArenaCurrentPlayersCount = [{"PlayerNumber":"1","Name":"Ahri_Loyala","Team":"Blue"},{"PlayerNumber":"2","Name":"Raven_Blackblood","Team":"Red"}]
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
		const changePlayers = (p) => {return event.server.persistentData.gunArenaCurrentPlayersCount = p;}
		//let resetPlayers = changePlayers([])
		if (resetBool){changePlayers([]); return;}
		Utils.server.tell('initializeCurrentPlayers Function Called')	
	}
	
	function pushCurrentPlayers(playerName, playerNumber){
		//const currentPlayers = event.server.persistentData.gunArenaCurrentPlayersCount
		let player = `{"PlayerNumber":"${playerNumber}","Name":"${playerName}","Team":"None"}`
		event.server.persistentData.gunArenaCurrentPlayersCount.push(JSON.parse(player))
		return;
	}
	
	function assignToTeam (playerCardInscribed, team) {
		let i = 0;
		
		
		
		currentPlayersCount()[i].Team = (team)
		return;
		
	}
	
	function changeLore() {
		let i = 0;
		let loreString = entityData.getInventory().getItem(slot).getTag().display.Lore // get Item lore
		let stringifiedLore = ""
		stringifiedLore = stringifiedLore + loreString;
		let loreRegex = /STATUS/
		let loreIndex = stringifiedLore.search(loreRegex)
		let newStatus = `Prematch - Registered to ${stringifiedPlayerName} as Player ${currentPlayersCount().length + 1}`
		let modifiedLore = stringifiedLore.substring(0, (loreIndex + 8)) + newStatus + stringifiedLore.substring((loreIndex + 26))
		entityData.getInventory().getItem(slot).getTag().display.Lore = eval(modifiedLore);
		return;
	}
	
	const lifetimePlayersCount = () => {return event.server.persistentData.gunArenaLifetimePlayersCount}
	const currentPlayersCount = () => {return event.server.persistentData.gunArenaCurrentPlayersCount}
	
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
			.then(Commands.literal('test')
				.then(Commands.argument('item-id', Arguments.STRING.create(event))
					.executes(ctx => {
					Utils.server.tell("test subcommand")
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
			.then(Commands.literal('stage-two').executes(ctx => {
				//Commences stage 2 of Card, setting Card Inscribed NBT to Stage 2 and binding card to player				
					
				//let inventory = entityData.inventory.contains('create_things_and_misc:card') /use to check for item :D
				//let $tagList = java('net.minecraft.nbt.ListTag') DO NOT USE
				//let $JSONtoNBT = java('net.minecraft.nbt.TagParser') DO NOT USE
				let entityData = ctx.source.entity
				let size = entityData.getInventory().items.length
				//let name = entityData.name.contents
				
				for (let slot = 0; slot < (size + 5); slot++) {
				let invSlotId = entityData.getInventory().getItem(slot).serializeNBT().id //get ID from NBT of item
				
				//Utils.server.tell("Slot " + slot + " has an id of " + invSlotId)	
				
				//Loops through inventory finding cards matching the right NBT, and takes the first one it finds.
					if (invSlotId == "create_things_and_misc:card") {
						//Utils.server.tell("SUCCESFULLY FOUND A CARD");
						let cardTag = entityData.getInventory().getItem(slot).getTag().Inscribed //get the NBT dat adown to the Inscribed key for validation
						
						if (cardTag == "Vulpine Co. [stage1-valid]") {
							if (entityData.stages.has('ga_registered_player')) {event.server.tell("Found a valid Card, but you are already registered!"); return;}
							if (currentPlayersCount().length >= maxPlayers) {event.server.tell("Found a valid Card, but player slots are full! Please wait until the next match."); return;}
							//if (matchOngoing) {event.server.tell("Found a valid Card, but a match is currently underway! Please wait until the next match. Go watch some pew pews in the meantime :)"); return;} future-proofing
							let nameString = entityData.getInventory().getItem(slot).getTag().display.Name // get Item display name
							let nameRegex = /(.")(,)/
							let nameIndex = nameString.search(nameRegex)
							let playerName = entityData.name.contents
							let stringifiedPlayerName = ""
							stringifiedPlayerName = stringifiedPlayerName + playerName;
							let modifiedName = nameString.substring(0, (nameIndex + 1)) + ` ${stringifiedPlayerName} ` + nameString.substring((nameIndex + 1))
							let loreString = entityData.getInventory().getItem(slot).getTag().display.Lore // get Item lore
							let stringifiedLore = ""
							stringifiedLore = stringifiedLore + loreString;
							let loreRegex = /STATUS/
							let loreIndex = stringifiedLore.search(loreRegex)
							let newStatus = `Prematch - Registered to ${stringifiedPlayerName} as Player ${currentPlayersCount().length + 1}`
							let modifiedLore = stringifiedLore.substring(0, (loreIndex + 8)) + newStatus + stringifiedLore.substring((loreIndex + 26))
							event.server.tell(`Found a valid Card! You have been registered as Player ${currentPlayersCount().length + 1}.`); //not sure if this will whisper or tell the whole server
							entityData.getInventory().getItem(slot).getTag().display.Name = modifiedName;
							entityData.getInventory().getItem(slot).getTag().Inscribed = "Vulpine Co. [stage2-prematch]"; //Set the NBT tag to stage2
							entityData.getInventory().getItem(slot).getTag().display.Lore = eval(modifiedLore);
							pushCurrentPlayers(stringifiedPlayerName, (currentPlayersCount().length + 1));
							entityData.addTag('ga_registered_player')
							
							break;
						} else {continue};
					};	// else Utils.server.tell("No Card Found");	//else invSlotId == "minecraft:air";
				};
				return 1
				})
			).then(Commands.literal('currentplayers')
				.then(Commands.literal('query').executes(ctx => {
					initializeCurrentPlayers(null, 0)
					Utils.server.tell("Current Player Count is " + currentPlayersCount()[0].Team)
					//Utils.server.tell("Keys are " + Object.keys(currentPlayers[0]))
					Utils.server.tell("Length is: " + currentPlayersCount().length)
					return 1
					})
				)
				.then(Commands.literal('reset').executes(ctx => {
					
					initializeCurrentPlayers(0, 1)
					Utils.server.tell("Current Player Count is " + currentPlayersCount())
					
					return 1
					})
				)
				.then(Commands.literal('build').executes(ctx => {
					//USELESS, FOR REMOVAL
					//Object.assign(event.server.persistentData.gunArenaCurrentPlayersCount[0], {Kils: "0"})
					Utils.server.tell("Player 1 is " + event.server.persistentData.gunArenaCurrentPlayersCount[0])
					//event.server.persistentData.gunArenaCurrentPlayersCount[0]['Kills'] = "0"
					Utils.server.tell("Pushed to Current Players, and it is now: " + currentPlayersCount())
					
					return 1
					})
				)
			)
			.then(Commands.literal('pre-stage-three').executes(ctx => {
				
				if (currentPlayersCount().length < minPlayers || isPrematchTimerTicking) {return;}
				prematchTimer = prematchTimerDefault
				Utils.server.tell("Minimum amount of players are present. Match starting soon!")
				//Periodic checks to see if a match is viable; that is, two or more players are registered
				recursiveTimer()
				isPrematchTimerTicking = true
				
				function recursiveTimer(){
					
					if (prematchTimer <= 0) {Utils.server.tell("boom baby"); return; }
					Utils.server.tell("(loop) Match starts in " + prematchTimer)
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
				.then(Commands.literal('blue').executes(ctx => {
					
					assignToTeam(0, "Blue")
					return 1
					})
				)
			).then(Commands.literal('functions') //collection of subcommands to serve as functions to be called inside other commands to get stuff done. Pls dont @ me im just trying to follow DRY principle Sadge
				.then(Commands.literal('modify-lore')
					.then(Commands.argument('slot', Arguments.INTEGER.create(event))
						.then(Commands.argument('pipe-index', Arguments.INTEGER.create(event))
							.then(Commands.argument('new-lore', Arguments.STRING.create(event))
								.executes(ctx => {
									// REGEX ATTEMTPS: /^[|]+?|[^|]+$/ matches last |... but 1000 steps kekw
									//(?<=[|])(.*)[|]{1}
									//https://stackoverflow.com/questions/30210118/regex-to-match-substring-after-nth-occurence-of-pipe-character
									//^((?:[^|]*\|){1})[^|]+
									//^((?:[^|]*\|){1})[^|]+
									//^(?:[^|]*\|){1}([^|]*)
									//^(?:[^|]*\|){1}([^|]*)
									//(?<=\|)(.*?)(?=\|)
									/*
									
									
									let newStatus = `Prematch - Registered to Ahri_Loyala as Player ${currentPlayersCount().length + 1}`
									let modifiedLore = stringifiedLore.substring(0, (loreIndex + 8)) + newStatus + stringifiedLore.substring((loreIndex + 26))
									entityData.getInventory().getItem(slot).getTag().display.Lore = eval(modifiedLore);
									
							
									
									*/
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
										
										
										//Utils.server.tell("Keys: " + Object.keys(entityData.getInventory().getItem(1).getTag().display.Lore[0]))
										Utils.server.tell("Obj: " + getLore())
										Utils.server.tell("Regex is: " + RegExp(buildRegex(pipeIndex)))
										Utils.server.tell("Captured Index is: " + stringStartIndex)
										Utils.server.tell("Captured start letter is: " + getLore()[stringStartIndex+1])
										Utils.server.tell("Captured end letter is: " + getLore()[stringEndIndex-3])
										Utils.server.tell("Modified NBT: " + modifiedLore)
									}
									return 1
								})
							)
						)
					)
				)
			.then(Commands.literal('BLANK').executes(ctx => {

				//Add code here
				//For copy-pasting purposes
				//KEEP RETURN
				return 1
				})
			)
		)
	)
  
	
	
})
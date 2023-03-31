

onEvent('item.entity_interact', event => {
	
	
	
	if (event.target.type == "minecraft:fox" & event.item.id == "minecraft:nether_star"){
	
	
	var lifetimePlayers = event.server.persistentData.lifetimePlayersCount;
	//const addToLifetimePlayers = event.server.persistentData.lifetimePlayersCount++
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
	addToLifetimePlayers(1)
	Utils.server.tell("Lifetime players is now: " + lifetimePlayers)
	return
	}
	
	//event.player.inventory.removeItem(!nonCapsule)
	
	function resetLifetimePlayers(){
		let data = event.server.persistentData.lifetimePlayersCount
		event.server.persistentData.lifetimePlayersCount = 0//{"count": 1}
		return data
	}
	
	function addToLifetimePlayers(number){
		let data = event.server.persistentData.lifetimePlayersCount
		event.server.persistentData.lifetimePlayersCount = event.server.persistentData.lifetimePlayersCount + number
		return data
	}
	
})


function mathTest(number){
	let maf = 1 + number
	return maf
}





onEvent("command.registry", event => {
	const { commands: Commands, arguments: Arguments} = event;
	//var lifetimePlayers = event.server.persistentData.lifetimePlayersCount;
	
	function addToLifetimePlayers(number){
		let data = event.server.persistentData.lifetimePlayersCount
		event.server.persistentData.lifetimePlayersCount = event.server.persistentData.lifetimePlayersCount + number
		return data
	}
	
	
	event.register(
		Commands.literal('vps')
			.requires(src => src.hasPermission(2))
			.then(Commands.literal('card')	
				.then(Commands.argument('rel-pos-x', Arguments.INTEGER.create(event))
					.then(Commands.argument('rel-pos-y', Arguments.INTEGER.create(event))
						.then(Commands.argument('rel-pos-z', Arguments.INTEGER.create(event))
							.executes(ctx => {
								
								var lifetimePlayers = event.server.persistentData.lifetimePlayersCount
								const relPosX = Arguments.INTEGER.getResult(ctx, "rel-pos-x");
								const relPosY = Arguments.INTEGER.getResult(ctx, "rel-pos-y");
								const relPosZ = Arguments.INTEGER.getResult(ctx, "rel-pos-z");
								const pos = ctx.source.position
								let posX = Math.floor(pos.x())
								let posY = Math.floor(pos.y())
								let posZ = Math.floor(pos.z())
								let paddedId = lifetimePlayers.toString().padStart(5,0)
								
								addToLifetimePlayers(1)
								//Utils.server.runCommand('data merge block ' + (posX + relPosX)+ ' ' + (posY + relPosY) + ' ' + (posZ + relPosZ) + ` {Items:[{Slot:0b,id:"create_things_and_misc:card", Count: 1b, tag:{Inscribed:"Vulpine Co. [stage1-valid]",display:{Name:'[{"text":"Gun Arena ID-${paddedId}","italic":false}]'}}}]}`)
								Utils.server.runCommand('data merge block ' + (posX + relPosX)+ ' ' + (posY + relPosY) + ' ' + (posZ + relPosZ) + ` {Items:[{Slot:0b,id:"create_things_and_misc:card", Count: 1b, tag:{Inscribed:"Vulpine Co. [stage1-valid]",display:{Name:'[{"text":"Gun Arena ID-${paddedId}","italic":false}]',Lore:['[{"text":"CARD ID: ${paddedId} | STATUS: Valid Entry Ticket","italic":false}]']}}}]}`)
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
			.then(Commands.literal('lifetime-players').executes(ctx => {
				var lifetimePlayers = event.server.persistentData.lifetimePlayersCount
				Utils.server.tell("Total Player Count is " + lifetimePlayers)
				return 1
				})
			)
			.then(Commands.literal('stage-two').executes(ctx => {
				//Commences stage 2 of card, setting card Inscribed NBT to Stage 2 and binding card to player				
				
					//let name = entityData.getName().getContents()								
					//let inventory = entityData.inventory.contains('create_things_and_misc:card') /use to check for item :D
				let $tagList = java('net.minecraft.nbt.ListTag')
				//let $JSONtoNBT = java('net.minecraft.nbt.TagParser')
				let entityData = ctx.source.entity
				let size = entityData.getInventory().items.length
				let name = entityData.name.contents
				
				let loreString = entityData.getInventory().getItem(1).getTag().display.Lore // get Item lore
				let stringifiedLore = ""
				stringifiedLore = stringifiedLore + loreString
				const loreRegex = /STATUS/
				let loreIndex = stringifiedLore.search(loreRegex)
				let newLore = "Blue da be daa"
				//let modifiedLore = JSON.stringify(String.raw`${stringifiedLore.substring(0, (loreIndex + 8)) + newLore + stringifiedLore.substring((loreIndex + 26))}`)
				let modifiedLore = stringifiedLore.substring(0, (loreIndex + 8)) + newLore + stringifiedLore.substring((loreIndex + 26))
				//let tagListLore = new $tagList() //(entityData.getInventory().getItem(1).getTag().display.Lore)
				let tagListLore = eval(modifiedLore)
				let addToTagListLore = tagListLore.push(modifiedLore)
				
				
				let rawNewLore = modifiedLore//.replace(/^\"|\"$/gm, "")
				let loreSanitizeRegex = /\"/gm
				let loreSanitizeGet = entityData.getInventory().getItem(1).getTag().display
				let stringifiedLoreSanitizeGet = ""
				stringifiedLoreSanitizeGet = stringifiedLoreSanitizeGet + loreSanitizeGet
				
				
				
				//let seralizeLore = entityData.getInventory().getItem(1).serializeNBT().tag.display.Lore
				//let modifyLore = String.raw`${entityData.getInventory().getItem(1).getTag().display.Lore}`
				//entityData.getInventory().getItem(1).getTag().display.Lore = " "// //['[{"text":"CARD ID: 00053 | STATUS: Blue da be daa","italic":false}]']
				//entityData.getInventory().getItem(1).getTag().display.Lore = `${entityData.getInventory().getItem(1).getTag().display.Lore} Test`
				//entityData.getInventory().getItem(1).getTag().display = toString(entityData.getInventory().getItem(1).getTag().display.replace(loreSanitizeRegex, 'fox'))
				entityData.getInventory().getItem(1).getTag().display.Lore = eval(modifiedLore)
				
				//entityData.getInventory().getItem(1).serializeNBT().tag.display.Lore = "tes"
				
				
				//let whisper = entityData.sendMessage(("MrCrayfish's Device Mod:"), "1")
				//let whisper = entityData.getInventory().getItem(1).tag.display.Lore
				
				
				
				
				//Utils.server.tell("Keys are " + Object.keys(whisper))
				//Utils.server.tell("Type is " + typeof(loreString))
				Utils.server.tell("Object is " + loreString + " and Raw string is " + stringifiedLore)
				Utils.server.tell("Altered lore is " + modifiedLore + " and its type is " + typeof(modifiedLore))
				Utils.server.tell("Rawified New lore is " + rawNewLore + " and its type is " + typeof(rawNewLore))
				Utils.server.tell("Display full is: " + stringifiedLoreSanitizeGet + " and is type " + typeof(stringifiedLoreSanitizeGet))
				Utils.server.tell("Type of thing is " + (entityData.getInventory().getItem(1).getTag().display.Lore instanceof $tagList))
				Utils.server.tell("Last type search: " + typeof(tagListLore) + " and is " + tagListLore + " and has keys: " + Object.keys(tagListLore))
				
				//Utils.server.tell("Keys are :" + + entityData.getInventory().getItem(1).getTag().display.Lore)
				//Utils.server.tell("Source keys are :" + (ctx.source.getPlayerOrException()))
				
				//Utils.server.tell("SNBT is " + seralizeLore)
				//Utils.server.tell("modifyLore is" + modifyLore)
				//Utils.server.tell("Stringification worked as such: " + stringifiedName + " and its type is " + typeof(stringifiedName))
				
				
				//let inventory = entityData.getInventory().getItem(1).getTag().Inscribed = "Vulpine Co. [stage2-prematch]" //get the NBT tag down to the Inscribed key

				
				for (let slot = 0; slot < (size + 5); slot++) {
				let invSlotId = entityData.getInventory().getItem(slot).serializeNBT().id //get ID from NBT of item
				
				//Utils.server.tell("Slot " + slot + " has an id of " + invSlotId)	
				
				//Loops through inventory finding cards matching the right NBT, and takes the first one it finds.
					if (invSlotId == "create_things_and_misc:card") {
						//Utils.server.tell("SUCCESFULLY FOUND A CARD");
						let cardTag = entityData.getInventory().getItem(slot).getTag().Inscribed //get the NBT dat adown to the Inscribed key for validation
						
						if (cardTag == "Vulpine Co. [stage1-valid]") {
							let nameString = entityData.getInventory().getItem(slot).getTag().display.Name // get Item display name
							const nameRegex = /(.")(,)/
							let nameIndex = nameString.search(nameRegex)
							let playerName = entityData.name.contents
							let stringifiedPlayerName = ""
							stringifiedName = stringifiedName + playerName
							let modifiedName = nameString.substring(0, (nameIndex + 1)) + ` ${stringifiedPlayerName} ` + nameString.substring((nameIndex + 1))							
							event.server.tell("Found a valid Card!"); //not sure if this will whisper or tell the whole server
							entityData.getInventory().getItem(slot).getTag().display.Name = modifiedName;
							entityData.getInventory().getItem(slot).getTag().Inscribed = "Vulpine Co. [stage2-prematch]"; //Set the NBT tag to stage2
							
							
							
							break;
						} else {continue};
					};	// else Utils.server.tell("No Card Found");	//else invSlotId == "minecraft:air";
				};
				
				
				
				return 1
				})
			)
	)
  
	
	
})
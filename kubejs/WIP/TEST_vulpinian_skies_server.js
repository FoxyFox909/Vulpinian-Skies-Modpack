

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
								
								Utils.server.runCommand('data merge block ' + (posX + relPosX)+ ' ' + (posY + relPosY) + ' ' + (posZ + relPosZ) + ` {Items:[{Slot:0b,id:"create_things_and_misc:card", Count: 1b, tag:{Inscribed:"Vulpine Co. [stage1-valid]",display:{Name:'[{"text":"Gun Arena ID-${paddedId}","italic":false}]'}}}]}`)
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
								
				//entityData.getInventory().getItem(1).setTag(Inscribed.merge(null)) //not working
				//let inventory = entityData.inventory.contains('create_things_and_misc:card') /use to check for item :D
				//let inventory = entityData.getInventory().player.inventory.get(1) /not working
				
				
				let entityData = ctx.source.entity
				let size = entityData.getInventory().items.length
				let name = entityData.name.contents
				//let inventory = entityData.getInventory().getItem(1).getTag().Inscribed = "Vulpine Co. [stage2-prematch]" //get the NBT tag down to the Inscribed key
			/* "[a-zA-Z0-9 -]*"(?=:):[a-zA-Z0-9 "-ć]*(?<=")|"[a-zA-Z0-9 -]*"(?=:):[a-zA-Z0-9 "-ć]*(?=,)|"[a-zA-Z0-9 -]*"(?=:):[a-zA-Z0-9 "-ć]*(?=\w+) */
			// ^([^"]*["]){4}[^"].*$ semi working regex
			// *"([^"]+)(?=") best working regex
				//let nameString = entityData.getInventory().getItem(1).serializeNBT().tag.display.Name // get Item display name
				/*
				let parsedNameString = nameString.split(/(?=")/)
				parsedNameString[3] = parsedNameString[3].concat(" Text test1", "Text test 3")
				let preFinalNameString = parsedNameString.join()
				let finalNameString = `{Name:'${preFinalNameString}'}`*/
				//(.")(,) BEST WORKING REGEX
				//console.log(str.substring(0, (nameIndex + 1)) + " injected text" + str.substring((nameIndex + 1)));
				
				let nameString = entityData.getInventory().getItem(1).getTag().display.Name // get Item display name
				const nameRegex = /(.")(,)/
				let nameIndex = nameString.search(nameRegex)
				let modifiedName = nameString.substring(0, (nameIndex + 1)) + " injected text" + nameString.substring((nameIndex + 1))
				entityData.getInventory().getItem(1).getTag().display.Name = modifiedName
				
				
				//let tagLookup = entityData.getInventory().getItem(1).getTag().display = `{Name:'${finalNameString}'}`

				//Utils.server.tell("Contents to be JSONED are " + nameString)
				//Utils.server.tell("Keys are " + Object.keys(parsedNameString))
				//Utils.server.tell("Type is  " + typeof(parsedNameString[3]))
				//Utils.server.tell("Contents are " + parsedNameString)
				//Utils.server.tell("Modified string is " + parsedNameString[3])
				//Utils.server.tell("Modified array is " + parsedNameString)
				//Utils.server.tell("Joined and ready to ship NBT is " + finalNameString)
				//Utils.server.tell("Value of tags " + tagLookup)

				Utils.server.tell("Contents of Tag are " + nameString)
				Utils.server.tell("Type of Tag is " + typeof(nameString))
				Utils.server.tell("Injected text like so: " + modifiedName)
				
				
				
				
				
				for (let slot = 0; slot < size; slot++) {
				let invSlotId = entityData.getInventory().getItem(slot).serializeNBT().id //get ID from NBT of item
				
				//Utils.server.tell("Slot " + slot + " has an id of " + invSlotId)	
				
				//Loops through inventory finding cards matching the right NBT, and takes the first one it finds.
					if (invSlotId == "create_things_and_misc:card") {
						Utils.server.tell("SUCCESFULLY FOUND A CARD");
						let cardTag = entityData.getInventory().getItem(slot).getTag().Inscribed //get the NBT dat adown to the Inscribed key for validation
						
						if (cardTag == "Vulpine Co. [stage1-valid]") {
							Utils.server.tell("Card is valid");
							break;
						} else {continue};
					}; 	//else invSlotId == "minecraft:air";
				};
				
				
				
				return 1
				})
			)
	)
  
	
	
})
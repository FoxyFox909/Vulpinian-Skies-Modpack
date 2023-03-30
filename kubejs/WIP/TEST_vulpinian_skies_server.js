

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
				let entityData = ctx.source.entity
				//let name = entityData.getName().getContents()
				let name = entityData.name.contents
				Utils.server.tell("Contents are " + name)
				return 1
				})
			)
	)
  
	
	
})
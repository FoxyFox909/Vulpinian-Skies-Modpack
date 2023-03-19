// priority: 0

settings.logAddedRecipes = true
settings.logRemovedRecipes = true
settings.logSkippedRecipes = false
settings.logErroringRecipes = true

console.info('KubeJS server script loaded')

onEvent('recipes', event => {
	// Change recipes here
	
	
	
	//removed EFLN item due to being too op as a hand-thrown nuclear warhead
	event.remove({id:'tconstruct:gadgets/throwball/efln_ball'})
	
	
	//Crayfish ammunition Create recipes
	let interBasicBullet = 'kubejs:incomplete_basic_bullet'
	event.remove ({id:'cgm:basic_bullet'})
	event.recipes.createSequencedAssembly([
	Item.of('16x cgm:basic_bullet')
	],'create:brass_sheet',[
	event.recipes.createDeploying(interBasicBullet,[interBasicBullet, 'createbigcannons:packed_gunpowder']),
	event.recipes.createDeploying(interBasicBullet,[interBasicBullet, 'minecraft:iron_nugget']),
	event.recipes.createPressing(interBasicBullet, interBasicBullet)
	]).transitionalItem(interBasicBullet).loops(1)
	
	

	let interAdvancedBullet = 'kubejs:incomplete_advanced_bullet'
	event.remove ({id:'cgm:advanced_bullet'})
	event.recipes.createSequencedAssembly([
	Item.of('16x cgm:advanced_bullet')
	],'create:copper_sheet',[
	event.recipes.createDeploying(interAdvancedBullet,[interAdvancedBullet, 'createbigcannons:packed_gunpowder']),
	event.recipes.createDeploying(interAdvancedBullet,[interAdvancedBullet, 'create:andesite_alloy']),
	event.recipes.createDeploying(interAdvancedBullet,[interAdvancedBullet, 'minecraft:iron_nugget']),
	event.recipes.createPressing(interAdvancedBullet, interAdvancedBullet)
	]).transitionalItem(interAdvancedBullet).loops(1)
	
	let interShell = 'kubejs:incomplete_shell'
	event.remove ({id:'cgm:shell'})
	event.recipes.createSequencedAssembly([
	Item.of('16x cgm:shell')
	],'minecraft:gold_ingot',[
	event.recipes.createDeploying(interShell,[interShell, 'createbigcannons:packed_gunpowder']),
	event.recipes.createDeploying(interShell, [interShell, 'createbigcannons:shot_balls']),
	event.recipes.createDeploying(interShell,[interShell, 'minecraft:red_carpet']),
	event.recipes.createPressing(interShell, interShell)
	]).transitionalItem(interShell).loops(1)
	
	let interMissile = 'kubejs:incomplete_missile'
	event.remove ({id:'cgm:missile'})
	event.recipes.createSequencedAssembly([
	Item.of('cgm:missile')
	],'minecraft:bucket',[
	event.recipes.createDeploying(interMissile,[interMissile, 'minecraft:tnt']),
	event.recipes.createFilling(interMissile, [interMissile, Fluid.of('sliceanddice:fertilizer',250)]),
	event.recipes.createDeploying(interMissile,[interMissile, 'minecraft:redstone']),
	event.recipes.createPressing(interMissile, interMissile)
	]).transitionalItem(interMissile).loops(1)






})

onEvent('item.tags', event => {
	// Get the #forge:cobblestone tag collection and add Diamond Ore to it
	// event.get('forge:cobblestone').add('minecraft:diamond_ore'
	// Get the #forge:cobblestone tag collection and remove Mossy Cobblestone from it
	// event.get('forge:cobblestone').remove('minecraft:mossy_cobblestone')
	
	//Allows stripped logs from Regions Unexplored and Twigs mods to be used with Create
	event.add('forge:stripped_logs', /regions_unexplored:stripped.+(_log|_wood)/)
	event.add('minecraft:flowers', 'iceandfire:frost_lily')
	event.add('minecraft:small_flowers', 'iceandfire:frost_lily')
	
	
	
})


//Starter items handler. Will scan starting players' inventories for items other than capsules and delete anything that is not a capsule.
onEvent('player.logged_in', event => {
	if (!event.player.stages.has('starting_items')) {
		event.player.stages.add('starting_items')
		//var capsule = "capsule:capsule"
		var inventory = event.player.inventory
		
		event.server.scheduleInTicks(200, callback => {
			for (let slot = 0; slot < inventory.size; slot++) {
				var invSlot = Item.of(inventory.get(slot))
						
				if (invSlot.id == "capsule:capsule") {
				Utils.server.tell(invSlot.id)
				} else invSlot.count = 0
			}
		});	
	}	
})





onEvent('item.entity_interact', event => {
	if (event.target.type != "minecraft:fox" || event.item.id != "minecraft:nether_star") return
	
	
	
	//Utils.server.tell("Triggered");
	//Utils.server.tell(Item.of(event.player.inventory.get(0).item.id))
	Utils.server.tell("Fox Clicked")
	Utils.server.tell( event.player.stages.has('starting_items'))
	event.player.stages.remove('starting_items')
	Utils.server.tell(event.player.stages.has('starting_items'))
	
	
	//event.player.inventory.removeItem(!nonCapsule)
})
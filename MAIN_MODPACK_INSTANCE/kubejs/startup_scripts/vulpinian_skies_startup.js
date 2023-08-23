// priority: 0

console.info('Loading Vulpinian Skies startup script');


onEvent('item.registry', event => {
	// Register new items here
	// event.create('example_item').displayName('Example Item')
	
		
	
	//Items used as intermediary items for sequenced assembly create recipes for Crayfish and Scorched guns ammo
	event.create('incomplete_basic_bullet','create:sequenced_assembly').texture('create:item/brass_sheet').unstackable();
	event.create('incomplete_advanced_bullet','create:sequenced_assembly').texture('create:item/copper_sheet').unstackable();
	event.create('incomplete_shell','create:sequenced_assembly').texture('minecraft:item/gold_ingot').unstackable();
	event.create('incomplete_missile','create:sequenced_assembly').texture('minecraft:item/bucket').unstackable();
	event.create('incomplete_grenade','create:sequenced_assembly').texture('minecraft:item/glass_bottle').unstackable();
	
	
	event.create('haunted_nitro').texture('kubejs:item/haunted_nitro'); //Not sequence assimbly for this one but it unifies Create Big Cannon's Nitro with Hell Gunpowder
	
	event.create('incomplete_encased_fire','create:sequenced_assembly').texture('minecraft:item/bucket').unstackable();
	// burn time of unstable_encased_fire calculated by (2400*2)+(20000*0.05)+(10*20*3)+600 = 7000 ticks or 350 seconds, which accounts for burning 2 blaze dords, 3 iron ingots, 0.050 buckets of lava, and 600 bonus ticks, which is about a 9 percent increase if other fuel was used to smelt iron ingots and 20 percent if ingots werent smelted
	event.create('unstable_encased_fire').tooltip('Too hot and volatile to be used as ammo. Needs to be stabilized by being run through a fan water wash. Can be used as fuel (burns for 350 seconds).').texture('kubejs:item/unstable_encased_fire').burnTime(7000)
	
	event.create('incomplete_ec_round', 'create:sequenced_assembly').displayName('Incomplete EC Round').texture('scorchedguns:item/flechette').unstackable()
	event.create('uncharged_ec_round').displayName('Uncharged EC Round').tooltip('Charge with a Tesla Coil').texture('kubejs:item/uncharged_ec_round')

	event.create('incomplete_scorched_bullet', 'create:sequenced_assembly').texture('scorchedguns:item/scorched_bronze_ingot').unstackable()	
	event.create('incomplete_scorched_big_bullet', 'create:sequenced_assembly').texture('scorchedguns:item/scorched_bronze_ingot').unstackable()
	event.create('incomplete_scorched_shell', 'create:sequenced_assembly').texture('scorchedguns:item/scorched_bronze_ingot').unstackable()
	
	event.create('incomplete_heavy_bullet','create:sequenced_assembly').texture('create:item/brass_sheet').unstackable()		
	
	event.create('incomplete_pig_round','create:sequenced_assembly').texture('create:item/golden_sheet').unstackable()
	event.create('incomplete_heavy_pig_round','create:sequenced_assembly').texture('create:item/golden_sheet').unstackable()
	event.create('incomplete_quartz_shell','create:sequenced_assembly').texture('create:item/golden_sheet').unstackable()
	
	event.create('incomplete_osborne_shell','create:sequenced_assembly').texture('createdeco:item/cast_iron_sheet').unstackable()
	
	event.create('incomplete_experimental_round','create:sequenced_assembly').texture('create_things_and_misc:items/experience_sheet').unstackable().glow(true)
	
	
	//Gun frames for Weapon Crafting Overhaul
	event.create('incomplete_class_f_frame','create:sequenced_assembly').texture('create:item/copper_sheet').unstackable()
	event.create('class_f_frame').texture('kubejs:item/class_f_frame').maxStackSize(16).rarity('common');
	
	event.create('incomplete_class_e_frame','create:sequenced_assembly').texture('createdeco:item/cast_iron_sheet').unstackable()
	event.create('class_e_frame').texture('kubejs:item/class_e_frame').maxStackSize(16).rarity('common');
	
	event.create('incomplete_class_d_frame','create:sequenced_assembly').texture('create:item/brass_sheet').unstackable()
	event.create('class_d_frame').texture('kubejs:item/class_d_frame').maxStackSize(16).rarity('uncommon');
	
	event.create('incomplete_class_c_frame','create:sequenced_assembly').texture('scorchedguns:item/scorched_bronze_ingot').unstackable()
	event.create('class_c_frame').texture('kubejs:item/class_c_frame').maxStackSize(16).rarity('rare');
	
	event.create('incomplete_class_b_frame','create:sequenced_assembly').texture('createdeco:item/netherite_sheet').unstackable()
	event.create('class_b_frame').texture('kubejs:item/class_b_frame').maxStackSize(16).rarity('rare');
	
	event.create('incomplete_class_a_frame','create:sequenced_assembly').displayName('Incomplete Class A Frame').texture('kubejs:item/class_b_frame').unstackable()
	event.create('class_a_frame').displayName('Class A Frame').texture('kubejs:item/class_a_frame').maxStackSize(16).rarity('rare');
	
	event.create('incomplete_class_s_frame','create:sequenced_assembly').texture('kubejs:item/class_c_frame').unstackable()
	event.create('class_s_frame').texture('kubejs:item/class_s_frame').maxStackSize(16).rarity('epic');
		
	
})

onEvent('fluid.registry', event => {

	let fluid = event.create('vulpinian_skies_core:necroethanol')
		.displayName('Necroethanol')		
		.stillTexture('vulpinian_skies_core:fluid/necroethanol_still')
		.flowingTexture('vulpinian_skies_core:fluid/necroethanol_flow')
		.rarity('rare')
		.density(2000)
		.viscosity(4500)		
	
	let bucket = new java('dev.latvian.mods.kubejs.fluid.FluidBucketItemBuilder')(fluid);
	
	bucket
		.burnTime(3600) //Not working, fix needed
		.rarity('rare')
	fluid.bucketItem = bucket;
})










/*
onEvent('block.registry', event => {
	
	//Fake blog creation for tag fixing
	event.create('quark:soul_stone');
		//.material('glass')
		//.hardness(0.5);	
		
	event.create('create_things_and_misc:copper_scaffolding');		
})
*/

/*MOVED TO CLIENT SCRIPT
onEvent('client.generate_assets', event => {	
	const rename = (itemId, newName) =>	{event.addLang(Item.of(itemId).item.getDescriptionId(), newName)};
		
	//list of individual renamed items
	rename('cgm:workbench', "Ballistics Workbench");
	rename('scorchedguns:hell_gunpowder', "Hellpowder"); //Renamed for consistency with pair powder, Nitropowder
	event.addLang(Item.of('quark:bottled_cloud').item.getDescriptionId(), 'Bottled Cloud');
	
	//event.server.scheduleInTicks(2000, callback => {
	
	//});

	//Rename collectible coins
	const coinNames = ["gold", "silver", "platinum", "netherite", "copper", "bronze", "brass", "iron", "stone"]
	let coinType = ""
	for (let i = 0; i < coinNames.length; i++) {
		coinType = coinNames[i]
		rename(`collectibles:${coinType}_coin`, `Antique ${coinType.charAt(0).toUpperCase()+coinType.slice(1)} Coin`)
	}
})
*/

/*
onEvent('block.registry', event => {
	// Register new blocks here
	// event.create('example_block').material('wood').hardness(1.0).displayName('Example Block')
})
*/





// priority: 0

console.info('Starup script loaded')


onEvent('item.registry', event => {
	// Register new items here
	// event.create('example_item').displayName('Example Item')
	
	
	//Items used as intermediary items for sequenced assembly create recipes for Crayfish guns ammo
	event.create('incomplete_basic_bullet','create:sequenced_assembly').texture('create:item/brass_sheet').unstackable()	
	event.create('incomplete_advanced_bullet','create:sequenced_assembly').texture('create:item/copper_sheet').unstackable()	
	event.create('incomplete_shell','create:sequenced_assembly').texture('minecraft:item/gold_ingot').unstackable()	
	event.create('incomplete_missile','create:sequenced_assembly').texture('minecraft:item/bucket').unstackable()

	
})




/*
onEvent('block.registry', event => {
	// Register new blocks here
	// event.create('example_block').material('wood').hardness(1.0).displayName('Example Block')
})
*/





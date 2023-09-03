// priority: 0

const $ConfigStorm = java('weather2.config.ConfigStorm');
const $ConfigEngine = java('com.jesz.createdieselgenerators.config.ConfigRegistry');

console.info('Vulpinian Skies Client Reloaded');


onEvent('jei.hide.items', event => {
	// Hide items in JEI here
	// event.hide('minecraft:cobblestone')
	event.hide('tconstruct:efln_ball');
	event.hide('scorchedguns:tin_bronze_ingot');
	event.hide('scorchedguns:nitro_dust');
	event.hide('createbigcannons:cast_iron_ingot');
	event.hide('buildersaddition:iron_rod');
	event.hide('createaddition:zinc_sheet');

	event.hide('createdieselgenerators:plant_oil_bucket');	
	event.hide('createdieselgenerators:ethanol_bucket');	
	event.hide('createdieselgenerators:biodiesel_bucket');
	
	event.hide('vulpinian_skies_core:vulpinian_logo_small_animated');
	
})

onEvent('jei.hide.fluids', event => {
  event.hide('createdieselgenerators:plant_oil');
  event.hide('createdieselgenerators:ethanol');
  event.hide('createdieselgenerators:biodiesel');
})

//Only way to hide Create-generated recipes
function removeSpoutDrain(event, modId, fluidArray) {
	
	for (let i = 0, len = fluidArray.length; i < len; i++) {		
	
		event.remove('create:spout_filling', `create:fill_minecraft_bucket_with_${modId}_${fluidArray[i]}`)
		event.remove('create:draining', `create:empty_${modId}_${fluidArray[i]}_bucket_of_${modId}_${fluidArray[i]}`)
	}
}

onEvent('jei.remove.recipes', event => {
    //use 'event.categoryIds' to get an array of all category names
    //console.log(event.categoryIds)
	
	removeSpoutDrain(event, 'createdieselgenerators', ['plant_oil', 'ethanol', 'biodiesel']);
})


onEvent('item.tooltip', tooltip => {
	
	tooltip.add(/collectibles:.*in/, Text.darkAqua('Not legal tender'));
	
	tooltip.add('weather2:weather_deflector', (
		Text.darkAqua(`Protects a large area (`)
			.append(Text.darkPurple(`${$ConfigStorm.Storm_Deflector_RadiusOfStormRemoval}-block radius`))
			.append(Text.darkAqua(` around the block) from destructive storms, tornadoes, etc.`))		
	));
	
	tooltip.add('createdieselgenerators:basin_lid', Text.darkAqua("Used for Fermenting."));
	tooltip.add('createbigcannons:basin_foundry_lid', Text.darkAqua("Used for Basin Melting."));
	
	tooltip.add('quark:bottled_cloud', (
		Text.darkAqua(`Obtained by using a bottle at `)
			.append(Text.darkPurple(`cloud level`))
			.append(Text.darkAqua(`.`))
	));
	
	tooltip.add('createaddition:seed_oil_bucket', (
		Text.darkAqua(`Weak and Slow fuel for engines. `)
			.append(Text.darkPurple(`Capacity: ${$ConfigEngine.WEAK_STRESS.get().floatValue()} SU / Speed: ${$ConfigEngine.SLOW_SPEED.get().floatValue()} RPM`))
			.append(Text.darkAqua(`.`))
	));
	
	tooltip.add('createaddition:bioethanol_bucket', (
		Text.darkAqua(`Weak and Fast fuel for engines. `)
			.append(Text.darkPurple(`Capacity: ${$ConfigEngine.WEAK_STRESS.get().floatValue()} SU / Speed: ${$ConfigEngine.FAST_SPEED.get().floatValue()} RPM`))
			.append(Text.darkAqua(`.`))
	));
	
	tooltip.add('vulpinian_skies_core:necroethanol_bucket', (
		Text.darkAqua(`Strong and Slow fuel for engines. `)
			.append(Text.darkPurple(`Capacity: ${$ConfigEngine.STRONG_STRESS.get().floatValue()} SU / Speed: ${$ConfigEngine.SLOW_SPEED.get().floatValue()} RPM`))
			.append(Text.darkAqua(`.`))
	));
	
	
})

onEvent('client.generate_assets', event => {	
	const rename = (itemId, newName) =>	{event.addLang(Item.of(itemId).item.getDescriptionId(), newName)};
		
	//list of individual renamed items
	rename('cgm:workbench', "Ballistics Workbench");
	rename('scorchedguns:hell_gunpowder', "Hellpowder"); //Renamed for consistency with pair powder, Nitropowder	
	rename('artifacts:cloud_in_a_bottle', "Cloud in a Jar");
	rename('weather2:weather_item', "Tornado in a Bottle");
	
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

onEvent('client.generate_assets', event => {

	//Effect descriptions
	event.addLang('effect.enlightened_end.radiated.description', "Emitted by some blocks and items. A high enough dose will start doing damage over time.");
	event.addLang('effect.farmersdelight.comfort.description', "Removes and grants immunity to Slowness, Hunger, and Weakness.");
  
	//Enchantment descriptions
	event.addLang('enchantment.grapplemod.wallrunenchantment.desc', "Grealy increases parkour abilities. Run toward a wall to start running along it. Jumps will be boosted while wall-running.");
	
	//Sound subtitles
	event.addLang('grapplemod.subtitle.doublejump', "Whoosh");
	event.addLang('scorchedguns.subtitle.regular_fire', "Gunfire");
	
});
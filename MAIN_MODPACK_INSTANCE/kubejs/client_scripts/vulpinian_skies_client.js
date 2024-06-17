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
	
	event.hide('undergarden:gloomgourd_pie');
	
});

onEvent('jei.hide.fluids', event => {
  event.hide('createdieselgenerators:plant_oil');
  event.hide('createdieselgenerators:ethanol');
  event.hide('createdieselgenerators:biodiesel');
});

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
});

onEvent('jei.add.items', event => {
	
	event.add('vulpinian_skies_core:gloomgourd_pie');
	event.add('vulpinian_skies_core:gloomgourd_pie_slice');
});


// Abstracted tooltips to put in the above shiftMap go here

/*const weakSlowFuel = () => { return [
		[Text.darkPurple('Engines'), Text.darkAqua(' can use this fluid as '), Text.darkPurple('fuel'), Text.darkAqua(':')],
		[Text.darkPurple('-'), Text.darkAqua(' Strength: Weak ('), Text.darkPurple(`${$ConfigEngine.WEAK_STRESS.get().floatValue()} KSU`), Text.darkAqua(')')],
		[Text.darkPurple('-'), Text.darkAqua(' Speed: Slow ('), Text.darkPurple(`${$ConfigEngine.SLOW_SPEED.get().floatValue()} RPM`, Text.darkAqua(')'))]
	];
};*/


// test
// smSetFuel('createaddition:seed_oil_bucket', 'W', 'S');

// Obsolete because fuels are JSON-based now in Diesel Generators.
// function smSetFuel (itemId, strengthType, speedType, omitShift) {
	
	// let strength, speed, strengthString, speedString;
	
	// if (strengthType.charAt(0).toUpperCase() == 'S') {		
		// strength = $ConfigEngine.STRONG_STRESS.get().floatValue();
		// strengthString = 'Strong';
	// } else {
		// strength = $ConfigEngine.WEAK_STRESS.get().floatValue();
		// strengthString = 'Weak';
	// }
	
	// if (speedType.charAt(0).toUpperCase() == 'F') {		
		// speed = $ConfigEngine.FAST_SPEED.get().floatValue();
		// speedString = 'Fast';
	// } else {
		// speed = $ConfigEngine.SLOW_SPEED.get().floatValue();
		// speedString = 'Slow';
	// }

	// const fuelTooltip = () => { return [
			// [
				// Text.darkPurple('Engines'), Text.darkAqua(' and '), Text.darkPurple('Blaze Burners'), Text.darkAqua(' can use this fluid as '), Text.darkPurple('fuel'), Text.darkAqua('. When powering Engines:'),
			// ],
			// [
				// Text.darkPurple('-'), Text.darkAqua(`Strength: ${strengthString} (`), Text.darkPurple(`${strength}`), Text.darkAqua(' KSU)')
			// ],
			// [
				// Text.darkPurple('-'), Text.darkAqua(`Speed: ${speedString} (`), Text.darkPurple(`${speed}`), Text.darkAqua(' RPM)')
			// ]
		// ];
	// };

	// if (omitShift) {
		// shiftBlacklist.push(itemId);
	// }

	// shiftMap.set(itemId, fuelTooltip());	

// }

const shiftMap = new Map();

// Items that should exclude the Shift tooltip
// Used to not double up on the message
// Programmatically populated by abstracted map-populating functions (such as smSetFuel)
let shiftBlacklist = [];

// Map of Create-like tooltips
// Tooltips are added here
shiftMap.set(
    'weather2:weather_deflector', [
        [
            Text.darkAqua('Protects a large area ('), Text.darkPurple('200-block radius'),
            Text.darkAqua(' around the block) from destructive storms, tornadoes, etc.')
        ]
]);

shiftMap.set(
    'quark:bottled_cloud', [
        [
            Text.darkAqua('Obtained by using a bottle at '), Text.darkPurple('cloud level'),
            Text.darkAqua('.')
        ]
]);

// No longer needed as Diesel Generator fuels are not fully JSON-based.
// smSetFuel('createaddition:seed_oil_bucket', 'W', 'S', true);
// smSetFuel('createaddition:bioethanol_bucket', 'W', 'F', true);
// smSetFuel('vulpinian_skies_core:necroethanol_bucket', 'S', 'S', false);

const holdShift = (tooltip) => {
   
   return (tooltip.isShift()) ? [Text.darkGray('Hold ['), Text.white('Shift'), Text.darkGray('] for Summary')] : Text.darkGray('Hold [').append(Text.gray('Shift').append(Text.darkGray('] for Summary')));
   
};

onEvent('item.tooltip', tooltip => {
	
		//Programmatically-generated Create-like tooltips
    for (let id of shiftMap) {		
		
		tooltip.addAdvanced(id, (item, advanced, text) => {
			
			let stringId = String(item.id);


			if (!shiftBlacklist.includes(stringId)) {
				text.add(holdShift(tooltip));				
			}

			//Utils.server.tell(stringId);
			//Utils.server.tell(shiftMap.get(stringId));
			//let len = shiftMap.get(item.id).length;
			//text.add(shiftMap.get(item.id));

			if (tooltip.isShift()) {
                let len = shiftMap.get(stringId).length;
                for (let i = 0; i < len; i++) {
                    text.add(' ');
                    text.add(shiftMap.get(stringId)[i]);
                }
			}

			/*if (tooltip.isShift()) {
				
				for (let i = 0, len = tt.length; i < len; i++) {
					
					text.add(' ');
					text.add(tt[i]);
				}
			}*/
		});		
    }
	
	tooltip.add(/collectibles:.*in/, Text.darkAqua('Not legal tender'));
	
	tooltip.add('weather2:weather_deflector', (
		Text.darkAqua(`Protects a large area (`)
			.append(Text.darkPurple(`${$ConfigStorm.Storm_Deflector_RadiusOfStormRemoval}-block radius`))
			.append(Text.darkAqua(` around the block) from destructive storms, tornadoes, etc.`))		
	));
	
	tooltip.add('createdieselgenerators:basin_lid', Text.darkAqua("Used for Fermenting."));
	tooltip.add('createbigcannons:basin_foundry_lid', Text.darkAqua("Used for Basin Melting."));
	
	// tooltip.add('quark:bottled_cloud', (
		// Text.darkAqua(`Obtained by using a bottle at `)
			// .append(Text.darkPurple(`cloud level`))
			// .append(Text.darkAqua(`.`))
	// ));
	
	// tooltip.add('createaddition:seed_oil_bucket', (
		// Text.darkAqua(`Weak and Slow fuel for engines. `)
			// .append(Text.darkPurple(`Capacity: ${$ConfigEngine.WEAK_STRESS.get().floatValue()} SU / Speed: ${$ConfigEngine.SLOW_SPEED.get().floatValue()} RPM`))
			// .append(Text.darkAqua(`.`))
	// ));
	
	// tooltip.add('createaddition:bioethanol_bucket', (
		// Text.darkAqua(`Weak and Fast fuel for engines. `)
			// .append(Text.darkPurple(`Capacity: ${$ConfigEngine.WEAK_STRESS.get().floatValue()} SU / Speed: ${$ConfigEngine.FAST_SPEED.get().floatValue()} RPM`))
			// .append(Text.darkAqua(`.`))
	// ));
	
	// tooltip.add('vulpinian_skies_core:necroethanol_bucket', (
		// Text.darkAqua(`Strong and Slow fuel for engines. `)
			// .append(Text.darkPurple(`Capacity: ${$ConfigEngine.STRONG_STRESS.get().floatValue()} SU / Speed: ${$ConfigEngine.SLOW_SPEED.get().floatValue()} RPM`))
			// .append(Text.darkAqua(`.`))
	// ));
	
	tooltip.add('createaddition:straw', (
		Text.darkAqua(`Allows blaze burners to use liquid fuel.`)
	));
	
	// TODO delete the first tooltip from this.
	tooltip.addAdvanced('create_things_and_misc:sprinkler', (item, advanced, text) => {
		//Utils.server.tell(""+ Object.keys(text));
        // Utils.server.tell(text.getClass());
        text.set(1, holdShift(tooltip));
        if (tooltip.isShift()) {
            text.add('');
            text.add([Text.darkAqua('Spreads '), Text.darkPurple('1000mB of liquid fertilizer'), Text.darkAqua(' on a '), Text.darkPurple('5x5 area'), Text.darkAqua('.')]);
        }
    });

});

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
	
	//Effect descriptions
	event.addLang('effect.enlightened_end.radiated.description', "Emitted by some blocks and items. A high enough dose will start doing damage over time.");
	event.addLang('effect.farmersdelight.comfort.description', "Removes and grants immunity to Slowness, Hunger, and Weakness.");
  
	//Enchantment descriptions
	event.addLang('enchantment.grapplemod.wallrunenchantment.desc', "Grealy increases parkour abilities. Run toward a wall to start running along it. Jumps will be boosted while wall-running.");
	
	//Sound subtitles
	event.addLang('grapplemod.subtitle.doublejump', "Whoosh");
	event.addLang('subtitle.scorchedguns.regular_fire', "Gunfire");
	event.addLang('subtitle.scorchedguns.supressed_fire', "Silenced Gunfire");
	event.addLang('subtitles.hmag.entity.ghost.ambient', "Ghost spooks");
	event.addLang('subtitles.hmag.entity.ghost.hurt', "Ghost hurts");
});
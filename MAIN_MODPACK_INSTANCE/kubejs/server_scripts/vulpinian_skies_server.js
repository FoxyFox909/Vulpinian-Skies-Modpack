// priority: 10

settings.logAddedRecipes = true
settings.logRemovedRecipes = true
settings.logSkippedRecipes = false
settings.logErroringRecipes = true

console.info('Loading Vulpinian Skies Main Server Script')

//Gun classes based on their Single-shot damage, Ammo Type, DPS, Effective Range, and Utility
const classSGuns = ['scorchedguns:officers_special', 'scorchedguns:cosmic_blitzer', 'scorchedguns:r498_gauss_cannon', 'scorchedguns:alfonz_repeating_punter', 'scorchedguns:alfonz_turnpike', 'scorchedguns:lg8_grenade_launcher', 'scorchedguns:astella', 'scorchedguns:earths_corpse']; // Straight to the moon
const classAGuns = ['scorchedguns:thunderhead', 'scorchedguns:vidas_smg', 'scorchedguns:cyclone']; //Around 100 DPS Average
const classBGuns = ['scorchedguns:sc_fusilage', 'scorchedguns:sc_dahka', 'scorchedguns:soul_drummer', 'cgm:bazooka', 'scorchedguns:gauss_rifle', 'scorchedguns:cogloader', 'scorchedguns:m99_krauser', 'scorchedguns:krauser_conversion', 'scorchedguns:osgood_50', 'scorchedguns:huot_auto', 'scorchedguns:spitfire', 'scorchedguns:kiln_gun', 'scorchedguns:punt_gun', 'scorchedguns:tt_jorm_keg', 'scorchedguns:tunck_37']; //Around 80-90 DPS Average
const classCGuns = ['scorchedguns:scorched_wand', 'scorchedguns:scorched_staff', 'scorchedguns:scorched_obrez_staff', 'scorchedguns:scorched_scatter_staff', 'scorchedguns:blasphemy', 'scorchedguns:sc_gowza', 'scorchedguns:gowza_32l', 'scorchedguns:frontier_sidearm', 'scorchedguns:sc_deputy', 'scorchedguns:sc_lawbringer', 'scorchedguns:lm_scoont', 'scorchedguns:lm_sekora', 'scorchedguns:lm_spear_trough', 'scorchedguns:lm_spear_ironport', 'scorchedguns:ooz_96', 'cgm:grenade_launcher', 'scorchedguns:invis_nvr_63', 'scorchedguns:skellik_65']; //Around 50 DPS Avarage
const classDGuns = ['cgm:pistol', 'cgm:shotgun', 'cgm:rifle', 'cgm:mini_gun', 'cgm:assault_rifle', 'cgm:machine_pistol', 'cgm:heavy_rifle', 'scorchedguns:waltz_conversion', 'scorchedguns:steyr_smg', 'scorchedguns:scattergun', 'scorchedguns:carabine_44', 'scorchedguns:g19_director', 'scorchedguns:m19_waltz_dehann', 'scorchedguns:volley_gun']; //Around 20-30 DPS Average
const classEGuns = ['scorchedguns:flechette_jet', 'scorchedguns:m12_waltz', 'scorchedguns:jury_rigged_wrist_breaker', 'scorchedguns:railworker', 'scorchedguns:jackhammer', 'scorchedguns:thumper']; // Around 15-20 DPS Average, not very reliable
const classFGuns = ['scorchedguns:hand_crossbow', 'scorchedguns:auto_crossbow', 'scorchedguns:scrap_cannon', 'scorchedguns:blunderbuss', 'scorchedguns:bastard_gun', 'scorchedguns:scrap_pistol', 'scorchedguns:riveter']; // Around 10 DPS Average, not very reliable
const classGGuns = ['scorchedguns:eoka_pistol', 'scorchedguns:pipe_musket', 'scorchedguns:noqq_gun']; //Around 4-5 DPS Average

//Only contains gems from the mod. diamond and emerald, for its set, need to be appended

onEvent('recipes', event => {
	
	//removed EFLN item due to being too op as a hand-thrown nuclear warhead
	event.remove({id:'tconstruct:gadgets/throwball/efln_ball'})
		
	event.remove({id:'cgm:workbench'});
	event.shaped('cgm:workbench', [
		'BBB',
		'III',
		'I I'
		], {
		B: 'create:brass_block',
		I: 'minecraft:iron_ingot'
	});
		
	
	/**Overhaul of recipes for munitions and guns*/		
	event.remove ({id:'createbigcannons:cutting/spring_wire_steel'});
	event.remove ({id:'createbigcannons:cutting/spring_wire_iron'});
	
	event.recipes.create.mixing('createbigcannons:spring_wire', ['3x #forge:wires/iron', '#forge:ingots/iron']).heated()	
	
	let interBasicBullet = 'vulpinian_skies_core:incomplete_basic_bullet'
	event.remove ({id:'cgm:basic_bullet'})
	event.recipes.createSequencedAssembly([
	Item.of('16x cgm:basic_bullet')
	],'create:brass_sheet',[
	event.recipes.createDeploying(interBasicBullet,[interBasicBullet, 'createbigcannons:packed_gunpowder']),
	event.recipes.createDeploying(interBasicBullet,[interBasicBullet, 'minecraft:iron_nugget']),
	event.recipes.createPressing(interBasicBullet, interBasicBullet)
	]).transitionalItem(interBasicBullet).loops(1).id('vulpinian_skies_core:basic_bullet')

	let interAdvancedBullet = 'vulpinian_skies_core:incomplete_advanced_bullet'
	event.remove ({id:'cgm:advanced_bullet'})
	event.recipes.createSequencedAssembly([
	Item.of('16x cgm:advanced_bullet')
	],'create:copper_sheet',[
	event.recipes.createDeploying(interAdvancedBullet,[interAdvancedBullet, 'createbigcannons:packed_gunpowder']),
	event.recipes.createDeploying(interAdvancedBullet,[interAdvancedBullet, 'create:andesite_alloy']),
	event.recipes.createDeploying(interAdvancedBullet,[interAdvancedBullet, 'minecraft:iron_nugget']),
	event.recipes.createPressing(interAdvancedBullet, interAdvancedBullet)
	]).transitionalItem(interAdvancedBullet).loops(1)
	
	let interShell = 'vulpinian_skies_core:incomplete_shell'
	event.remove ({id:'cgm:shell'})
	event.recipes.createSequencedAssembly([
	Item.of('16x cgm:shell')
	],'minecraft:gold_ingot',[
	event.recipes.createDeploying(interShell,[interShell, 'createbigcannons:packed_gunpowder']),
	event.recipes.createDeploying(interShell, [interShell, 'createbigcannons:shot_balls']),
	event.recipes.createDeploying(interShell,[interShell, 'minecraft:red_carpet']),
	event.recipes.createPressing(interShell, interShell)
	]).transitionalItem(interShell).loops(1)
	
	let interMissile = 'vulpinian_skies_core:incomplete_missile'
	event.remove ({id:'cgm:missile'})
	event.recipes.createSequencedAssembly([
	Item.of('cgm:missile')
	],'minecraft:bucket',[
	event.recipes.createDeploying(interMissile,[interMissile, 'minecraft:tnt']),
	event.recipes.createFilling(interMissile, [interMissile, Fluid.of('createaddition:bioethanol',250)]),
	event.recipes.createDeploying(interMissile,[interMissile, 'minecraft:redstone']),
	event.recipes.createPressing(interMissile, interMissile)
	]).transitionalItem(interMissile).loops(1)

	let interGrenade = 'vulpinian_skies_core:incomplete_grenade'
	event.remove ({id:'cgm:grenade'})
	event.recipes.createSequencedAssembly([
	Item.of('cgm:grenade')
	],'minecraft:glass_bottle',[
	event.recipes.createDeploying(interGrenade,[interGrenade, 'minecraft:gunpowder']),
	event.recipes.createFilling(interGrenade, [interGrenade, Fluid.of('createaddition:bioethanol',50)]),
	event.recipes.createDeploying(interGrenade,[interGrenade, 'minecraft:string'])
	]).transitionalItem(interGrenade).loops(1)
	
	let interEncased = 'vulpinian_skies_core:incomplete_encased_fire'
	event.remove ({id:'scorchedguns:encased_fire'})
	event.recipes.createSequencedAssembly([
	Item.of('4x vulpinian_skies_core:unstable_encased_fire')
	],'minecraft:bucket',[
	event.recipes.createDeploying(interEncased,[interEncased, 'minecraft:blaze_powder']),
	event.recipes.createFilling(interEncased, [interEncased, Fluid.of('minecraft:lava',50)]),
	event.recipes.createDeploying(interEncased,[interEncased, 'minecraft:blaze_powder']),
	event.recipes.createPressing(interEncased, interEncased)
	]).transitionalItem(interEncased).loops(1)
	event.recipes.createSplashing('scorchedguns:encased_fire', 'vulpinian_skies_core:unstable_encased_fire')
	
	
	event.remove ({id:'scorchedguns:pure_gunpowder'})
	event.recipes.create.mixing('8x scorchedguns:pure_gunpowder', ['4x #forge:gunpowder', '#forge:sand']).heated()
	let interECR = 'vulpinian_skies_core:incomplete_ec_round'
	event.remove ({id:'scorchedguns:ec_round'})
	event.recipes.createSequencedAssembly([
	Item.of('1x vulpinian_skies_core:uncharged_ec_round')
	],'scorchedguns:flechette',[
	event.recipes.createDeploying(interECR,[interECR, 'scorchedguns:pure_gunpowder']),
	event.recipes.createDeploying(interECR, [interECR, 'createdeco:cast_iron_nugget']),	
	event.recipes.createPressing(interECR, interECR)
	]).transitionalItem(interECR).loops(1)
	
	event.custom({
			 "type": "createaddition:charging",
		"input": {
				"count": 3,
				"item": "vulpinian_skies_core:uncharged_ec_round"
			},			
		"result": {
			"count": 1,
			"item": "scorchedguns:ec_round"
		  },
		"energy":16000
		}
	)
	
	//removes Tin Bronze Ingot from scorchedguns. It was an ingot that did only one thing in another recipe and looked like brass anyway, so changed Scorched Bronze recipe to use Brass, Copper, and 2 Blaze Powde
	event.remove ({id:'scorchedguns:tin_bronze_ingot'})
	event.remove ({id:'scorchedguns:scorched_bronze'})
	event.recipes.create.mixing('2x scorchedguns:scorched_bronze_ingot', ['#forge:ingots/brass', '#forge:ingots/copper', '2x #forge:dusts/blaze']).superheated()

	let interScorchedBullet = 'vulpinian_skies_core:incomplete_scorched_bullet'
	event.remove ({id:'scorchedguns:scorched_bullet'})
	event.recipes.createSequencedAssembly([
	Item.of('8x scorchedguns:scorched_bullet')
	],'scorchedguns:scorched_bronze_ingot',[
	event.recipes.createDeploying(interScorchedBullet,[interScorchedBullet, 'scorchedguns:pure_gunpowder']),
	event.recipes.createDeploying(interScorchedBullet, [interScorchedBullet, 'createdeco:cast_iron_nugget']),	
	event.recipes.createPressing(interScorchedBullet, interScorchedBullet)
	]).transitionalItem(interScorchedBullet).loops(1)
	
	let interScorchedBigBullet = 'vulpinian_skies_core:incomplete_scorched_big_bullet'
	event.remove ({id:'scorchedguns:scorched_big_bullet'})
	event.recipes.createSequencedAssembly([
	Item.of('4x scorchedguns:scorched_big_bullet')
	],'scorchedguns:scorched_bronze_ingot',[
	event.recipes.createDeploying(interScorchedBigBullet,[interScorchedBigBullet, 'create:andesite_alloy']),
	event.recipes.createDeploying(interScorchedBigBullet,[interScorchedBigBullet, 'scorchedguns:pure_gunpowder']),
	event.recipes.createDeploying(interScorchedBigBullet, [interScorchedBigBullet, 'createdeco:cast_iron_nugget']),	
	event.recipes.createPressing(interScorchedBigBullet, interScorchedBigBullet)
	]).transitionalItem(interScorchedBigBullet).loops(1)
	
	let interScorchedShell = 'vulpinian_skies_core:incomplete_scorched_shell'
	event.remove ({id:'scorchedguns:scorched_shell'})
	event.recipes.createSequencedAssembly([
	Item.of('8x scorchedguns:scorched_shell')
	],'scorchedguns:scorched_bronze_ingot',[
	event.recipes.createDeploying(interScorchedShell,[interScorchedShell, 'createbigcannons:shot_balls']),
	event.recipes.createDeploying(interScorchedShell,[interScorchedShell, 'scorchedguns:pure_gunpowder']),
	event.recipes.createDeploying(interScorchedShell, [interScorchedShell, 'minecraft:red_carpet']),	
	event.recipes.createPressing(interScorchedShell, interScorchedShell)
	]).transitionalItem(interScorchedShell).loops(1)
	
	let interHeavyBullet = 'vulpinian_skies_core:incomplete_heavy_bullet'
	event.remove ({id:'scorchedguns:heavy_bullet'})
	event.recipes.createSequencedAssembly([
	Item.of('4x scorchedguns:heavy_bullet')
	],'#forge:plates/brass',[
	event.recipes.createDeploying(interHeavyBullet,[interHeavyBullet, 'createbigcannons:packed_gunpowder']),
	event.recipes.createDeploying(interHeavyBullet,[interHeavyBullet, 'create:andesite_alloy']),
	event.recipes.createDeploying(interHeavyBullet, [interHeavyBullet, 'createdeco:cast_iron_nugget']),	
	event.recipes.createPressing(interHeavyBullet, interHeavyBullet)
	]).transitionalItem(interHeavyBullet).loops(1)
	
	//Deprecated
	//
	//event.recipes.create.mixing('3x scorchedguns:hell_gunpowder', ['#forge:gunpowder', '#forge:dusts/blaze', '#forge:crops/nether_wart']).heated()
	//
	//event.recipes.create.mixing('6x scorchedguns:nitro_dust', ['4x scorchedguns:pure_gunpowder', '#forge:nuggets/netherite_scrap']).heated()
	
	
	//Unify ScorchedGuns with C:BC
	event.remove ({id:'scorchedguns:hell_gunpowder'})
	event.recipes.create.haunting('vulpinian_skies_core:haunted_nitro', 'createbigcannons:congealed_nitro')
	event.recipes.create.crushing('2x scorchedguns:hell_gunpowder', 'vulpinian_skies_core:haunted_nitro')
	event.recipes.create.milling('2x scorchedguns:hell_gunpowder', 'vulpinian_skies_core:haunted_nitro')	
	event.remove ({id:'scorchedguns:nitro_dust'}) //Scorched Guns's Nitro Dust is replaced with C:BC's Nitropowder
	
	//Unify Create Deco with C:BC
	event.remove ({id:'createbigcannons:compacting/forge_cast_iron_ingot'})
	event.remove ({id:'createbigcannons:compacting/iron_to_cast_iron_ingot'})
	event.recipes.create.compacting('createdeco:cast_iron_ingot', Fluid.of('createbigcannons:molten_cast_iron', 90)); //90mB		
	
	
	event.remove ({id:'tconstruct:gadgets/shuriken/quartz_shuriken'})
	event.shapeless('4x tconstruct:quartz_shuriken', ['#forge:gems/quartz', '#forge:gems/quartz', '#forge:gems/quartz', '#forge:gems/quartz'])
	event.recipes.create.cutting('4x tconstruct:quartz_shuriken', '#forge:gems/quartz').processingTime(50)
	
	let interPigRound = 'vulpinian_skies_core:incomplete_pig_round'
	event.remove ({id:'scorchedguns:pig_round'})
	event.recipes.createSequencedAssembly([
	Item.of('8x scorchedguns:pig_round')
	],'#forge:plates/gold',[
	event.recipes.createDeploying(interPigRound,[interPigRound, 'scorchedguns:hell_gunpowder']),
	event.recipes.createDeploying(interPigRound,[interPigRound, 'tconstruct:quartz_shuriken']),
	event.recipes.createDeploying(interPigRound, [interPigRound, 'scorchedguns:scorched_bronze_nugget']),	
	event.recipes.createPressing(interPigRound, interPigRound)
	]).transitionalItem(interPigRound).loops(1)
	
	let interPigHeavyRound = 'vulpinian_skies_core:incomplete_heavy_pig_round'
	event.remove ({id:'scorchedguns:heavy_pig_round'})
	event.recipes.createSequencedAssembly([
	Item.of('4x scorchedguns:heavy_pig_round')
	],'#forge:plates/gold',[
	event.recipes.createDeploying(interPigHeavyRound,[interPigHeavyRound, 'create:andesite_alloy']),
	event.recipes.createDeploying(interPigHeavyRound,[interPigHeavyRound, 'scorchedguns:hell_gunpowder']),
	event.recipes.createDeploying(interPigHeavyRound,[interPigHeavyRound, 'tconstruct:quartz_shuriken']),
	event.recipes.createDeploying(interPigHeavyRound, [interPigHeavyRound, 'scorchedguns:scorched_bronze_nugget']),	
	event.recipes.createPressing(interPigHeavyRound, interPigHeavyRound)
	]).transitionalItem(interPigHeavyRound).loops(1)
	
	let interQuartzShell = 'vulpinian_skies_core:incomplete_quartz_shell'
	event.remove ({id:'scorchedguns:quartz_shell'})
	event.recipes.createSequencedAssembly([
	Item.of('6x scorchedguns:quartz_shell')
	],'#forge:plates/gold',[
	event.recipes.createDeploying(interQuartzShell,[interQuartzShell, 'tconstruct:quartz_shuriken']),
	event.recipes.createDeploying(interQuartzShell,[interQuartzShell, 'tconstruct:quartz_shuriken']),
	event.recipes.createDeploying(interQuartzShell,[interQuartzShell, 'scorchedguns:hell_gunpowder']),
	event.recipes.createDeploying(interQuartzShell, [interQuartzShell, 'scorchedguns:scorched_bronze_nugget']),	
	event.recipes.createPressing(interQuartzShell, interQuartzShell)
	]).transitionalItem(interQuartzShell).loops(1)
	
	
	let interOsborneShell = 'vulpinian_skies_core:incomplete_osborne_shell'
	event.remove ({id:'scorchedguns:osborne_slug'})
	event.recipes.createSequencedAssembly([
	Item.of('2x scorchedguns:osborne_slug')
	],'#forge:plates/cast_iron',[
	event.recipes.createDeploying(interOsborneShell,[interOsborneShell, 'createbigcannons:nitropowder']),
	event.recipes.createDeploying(interOsborneShell,[interOsborneShell, 'createbigcannons:shot_balls']),
	event.recipes.createDeploying(interOsborneShell,[interOsborneShell, 'minecraft:red_carpet']),	
	event.recipes.createPressing(interOsborneShell, interOsborneShell)
	]).transitionalItem(interOsborneShell).loops(1)
	
	let interExperimentalRound = 'vulpinian_skies_core:incomplete_experimental_round'
	event.remove ({id:'scorchedguns:experimental_round'})
	event.recipes.createSequencedAssembly([
	Item.of('2x scorchedguns:experimental_round')
	],'create_things_and_misc:experience_sheet',[
	event.recipes.createDeploying(interExperimentalRound,[interExperimentalRound, 'scorchedguns:pure_gunpowder']),
	event.recipes.createDeploying(interExperimentalRound,[interExperimentalRound, 'scorchedguns:scorched_bronze_nugget']),
	event.recipes.createDeploying(interExperimentalRound,[interExperimentalRound, 'createdeco:cast_iron_ingot']),	
	event.recipes.createPressing(interExperimentalRound, interExperimentalRound)
	]).transitionalItem(interExperimentalRound).loops(1)
	

	event.remove ({id:'cgm:stun_grenade'})
	event.shapeless('cgm:stun_grenade', ['cgm:grenade', '#forge:dusts/glowstone'])
	
	event.remove ({id:'scorchedguns:powder_and_ball'})
	event.shapeless('16x scorchedguns:powder_and_ball', ['#forge:gunpowder', 'minecraft:gravel', 'minecraft:paper'])
	
	event.remove ({id:'scorchedguns:simple_bullet'})
	event.shapeless('16x scorchedguns:simple_bullet', ['#forge:gunpowder', 'minecraft:iron_ingot', 'minecraft:paper'])
	
	event.remove ({id:'scorchedguns:shotbolt'})
	event.shapeless('4x scorchedguns:shotbolt', ['#forge:gunpowder', 'minecraft:arrow', 'minecraft:arrow', 'minecraft:arrow', 'minecraft:arrow'])
	
	event.remove ({id:'scorchedguns:volatile_scrap'})
	event.shapeless('16x scorchedguns:volatile_scrap', ['#forge:gunpowder', '#forge:gravel', '#forge:gravel', '#forge:gravel', '#forge:gravel', '#forge:gravel', '#forge:gravel', '#forge:gravel', '#forge:gravel'])
	
	event.remove ({id:'scorchedguns:rivet'})
	event.shapeless('4x scorchedguns:rivet', ['#forge:nuggets/iron', '#forge:nuggets/iron'])
	
	event.remove ({id:'scorchedguns:flechette'})
	event.shapeless('6x scorchedguns:flechette', ['#forge:nuggets/iron', '#forge:nuggets/iron', '#forge:nuggets/iron'])
	
	event.remove ({id:'scorchedguns:flechette_round'})
	event.shapeless('4x scorchedguns:flechette_round', ['minecraft:red_carpet', '#forge:nuggets/gold', 'scorchedguns:flechette'])	
	
	event.remove({id:'scorchedguns:ethereal_bullet'})
	event.custom({
			"type": "ars_nouveau:enchanting_apparatus",
			"keepNbtOfReagent": false,
			"output": {
				"item": "scorchedguns:ethereal_bullet"
			},			
			"pedestalItems": [
				{
					"item": {
						"item":"scorchedguns:diamond_steel_nugget"
					}
				},
				{
					"item": {
						"tag":"forge:gems/lapis"
					}
				},
				{
					"item": {
						"tag":"forge:plates/zinc"
					}
				},
				{
					"item": {
						"item":"create:experience_nugget"
					}
				}
			],
			"reagent": [
				{
					"item": "scorchedguns:experimental_round"
				}
			],
			"sourceCost": 250,			
		}
	)
	
	event.remove({id:'scorchedguns:ethereal_heavy_bullet'})
	event.custom({
			"type": "ars_nouveau:enchanting_apparatus",
			"keepNbtOfReagent": false,
			"output": {
				"item": "scorchedguns:ethereal_heavy_bullet"
			},			
			"pedestalItems": [
				{
					"item": {
						"item":"scorchedguns:diamond_steel_nugget"
					}
				},
				{
					"item": {
						"item":"scorchedguns:diamond_steel_nugget"
					}
				},
				{
					"item": {
						"tag":"forge:plates/brass"
					}
				},
				{
					"item": {
						"tag":"forge:dusts/diamond"
					}
				}
			],
			"reagent": [
				{
					"item": "scorchedguns:heavy_bullet"
				}
			],
			"sourceCost": 500,			
		}
	)
	
	event.remove({id:'scorchedguns:ethereal_shell'})
	event.custom({
			"type": "ars_nouveau:enchanting_apparatus",
			"keepNbtOfReagent": false,
			"output": {
				"item": "scorchedguns:ethereal_shell"
			},			
			"pedestalItems": [
				{
					"item": {
						"item":"scorchedguns:diamond_steel_nugget"
					}
				},
				{
					"item": {
						"item":"scorchedguns:diamond_steel_nugget"
					}
				},
				{
					"item": {
						"tag":"forge:nuggets/gold"
					}
				},
				{
					"item": {
						"tag":"forge:dusts/redstone"
					}
				}
			],
			"reagent": [
				{
					"item": "scorchedguns:scorched_shell"
				}
			],
			"sourceCost": 500,			
		}
	)
	
	event.remove({id:'scorchedguns:ethereal_ec_round'})
	event.custom({
			"type": "ars_nouveau:enchanting_apparatus",
			"keepNbtOfReagent": false,
			"output": {
				"item": "scorchedguns:ethereal_ec_round"
			},			
			"pedestalItems": [
				{
					"item": {
						"item":"scorchedguns:diamond_steel_nugget"
					}
				},
				{
					"item": {
						"item":"scorchedguns:diamond_steel_nugget"
					}
				},
				{
					"item": {
						"tag":"forge:wires/copper"
					}
				},
				{
					"item": {
						"tag":"forge:wires/gold"
					}
				}
			],
			"reagent": [
				{
					"item": "scorchedguns:ec_round"
				}
			],
			"sourceCost": 500,			
		}
	)
		
	event.custom({
			"type": "ars_nouveau:enchanting_apparatus",
			"keepNbtOfReagent": false,
			"output": {
				"item": "vulpinian_skies_core:ethereal_grenade"
			},			
			"pedestalItems": [
				{
					"item": {
						"item":"scorchedguns:diamond_steel_nugget"
					}
				},
				{
					"item": {
						"item":"scorchedguns:diamond_steel_nugget"
					}
				},
				{
					"item": {
						"item":"scorchedguns:diamond_steel_nugget"
					}
				},
				{
					"item": {
						"item":"scorchedguns:hell_gunpowder"
					}
				},
				{
					"item": {
						"item":"createbigcannons:nitropowder"
					}
				}
			],
			"reagent": [
				{
					"item": "cgm:grenade"
				}
			],
			"sourceCost": 750,			
		}
	)
		
	event.remove({id:'scorchedguns:diamond_steel'})
	event.recipes.create.mixing('scorchedguns:diamond_steel', [
		'2x #forge:gems/diamond',
		'1x #forge:nuggets/netherite',
		'3x #forge:nuggets/iron',
		'#forge:nuggets/nether_star',
		{fluidTag: "forge:experience", amount: 150}
	]).superheated()
	
	event.recipes.create.mixing('scorchedguns:diamond_steel', [
		Fluid.of('tconstruct:molten_diamond',200),
		'1x #forge:nuggets/netherite',
		'3x #forge:nuggets/iron',
		'#forge:nuggets/nether_star',
		{fluidTag: "forge:experience", amount: 150}
	]).superheated()


	//Custom gun recipes for CGM Workbench
	//Gun crafting overhauled: Each tier has a core item (frame) which is crafted via seq. assembly
	//Higher tier cores are more expensive
	
	let interClassFFrame = 'vulpinian_skies_core:incomplete_class_f_frame'	
	event.recipes.createSequencedAssembly([
	Item.of('vulpinian_skies_core:class_f_frame')
	],'#forge:plates/copper',[
	event.recipes.create.cutting(interClassFFrame, interClassFFrame).processingTime(40),
	event.recipes.createPressing(interClassFFrame, interClassFFrame)
	]).transitionalItem(interClassFFrame).loops(1)
	
	let interClassEFrame = 'vulpinian_skies_core:incomplete_class_e_frame'	
	event.recipes.createSequencedAssembly([
	Item.of('vulpinian_skies_core:class_e_frame')
	],'#forge:plates/cast_iron',[
	event.recipes.create.cutting(interClassEFrame, interClassEFrame).processingTime(50),
	event.recipes.createDeploying(interClassEFrame,[interClassEFrame, '#forge:ingots/copper']),	
	event.recipes.createPressing(interClassEFrame, interClassEFrame)
	]).transitionalItem(interClassEFrame).loops(1)
	
	let interClassDFrame = 'vulpinian_skies_core:incomplete_class_d_frame'	
	event.recipes.createSequencedAssembly([
	Item.of('vulpinian_skies_core:class_d_frame')
	],'#forge:plates/brass',[
	event.recipes.create.cutting(interClassDFrame, interClassDFrame).processingTime(50),
	event.recipes.createDeploying(interClassDFrame,[interClassDFrame, '#forge:ingots/cast_iron']),	
	event.recipes.createPressing(interClassDFrame, interClassDFrame),
	event.recipes.createDeploying(interClassDFrame,[interClassDFrame, '#forge:cogwheels']),
	event.recipes.createPressing(interClassDFrame, interClassDFrame)
	]).transitionalItem(interClassDFrame).loops(1)
	
	let interClassCFrame = 'vulpinian_skies_core:incomplete_class_c_frame'	
	event.recipes.createSequencedAssembly([
	Item.of('vulpinian_skies_core:class_c_frame')
	],'scorchedguns:scorched_bronze_ingot',[
	event.recipes.create.cutting(interClassCFrame, interClassCFrame).processingTime(80),
	event.recipes.createFilling(interClassCFrame, [interClassCFrame, Fluid.of('createbigcannons:molten_nethersteel',200)]),
	event.recipes.createFilling(interClassCFrame, [interClassCFrame, Fluid.of('tconstruct:molten_quartz',400)]),
	event.recipes.createDeploying(interClassCFrame,[interClassCFrame, 'scorchedguns:scorched_bronze_ingot']),
	event.recipes.createPressing(interClassCFrame, interClassCFrame)
	]).transitionalItem(interClassCFrame).loops(1)
	
	let interClassBFrame = 'vulpinian_skies_core:incomplete_class_b_frame'	
	event.recipes.createSequencedAssembly([
	Item.of('vulpinian_skies_core:class_b_frame')
	],'createdeco:netherite_sheet',[
	event.recipes.create.cutting(interClassBFrame, interClassBFrame).processingTime(100),
	event.recipes.createFilling(interClassBFrame, [interClassBFrame, Fluid.of('createbigcannons:molten_nethersteel',375)]),	
	event.recipes.createDeploying(interClassBFrame,[interClassBFrame, 'create:polished_rose_quartz']),
	event.recipes.createDeploying(interClassBFrame,[interClassBFrame, 'scorchedguns:scorched_bronze_ingot']),
	event.recipes.createPressing(interClassBFrame, interClassBFrame),
	event.recipes.createPressing(interClassBFrame, interClassBFrame),
	event.recipes.createPressing(interClassBFrame, interClassBFrame)
	]).transitionalItem(interClassBFrame).loops(1)
	
	let interClassAFrame = 'vulpinian_skies_core:incomplete_class_a_frame'	
	event.recipes.createSequencedAssembly([
	Item.of('vulpinian_skies_core:class_a_frame')
	],'vulpinian_skies_core:class_b_frame',[	
	event.recipes.createDeploying(interClassAFrame,[interClassAFrame, 'scorchedguns:diamond_steel_nugget']),		
	event.recipes.createPressing(interClassAFrame, interClassAFrame)
	]).transitionalItem(interClassAFrame).loops(1)
	
	let interClassSFrame = 'vulpinian_skies_core:incomplete_class_s_frame'	
	event.recipes.createSequencedAssembly([
	Item.of('vulpinian_skies_core:class_s_frame')
	],'vulpinian_skies_core:class_c_frame',[	
	event.recipes.createDeploying(interClassSFrame,[interClassSFrame, '#forge:nuggets/nether_star']),
	event.recipes.createDeploying(interClassSFrame,[interClassSFrame, '#forge:nuggets/nether_star']),
	event.recipes.createFilling(interClassCFrame, [interClassCFrame, Fluid.of('tconstruct:molten_diamond',900)]),
	event.recipes.createDeploying(interClassSFrame,[interClassSFrame, 'scorchedguns:diamond_steel']),
	event.recipes.createPressing(interClassSFrame, interClassSFrame)
	]).transitionalItem(interClassSFrame).loops(1)


	//Class G Guns
	event.remove ({id:'scorchedguns:eoka_pistol'})
	event.shaped('scorchedguns:eoka_pistol', [
			' S ',
			'FCC',
			'P  '
			], {						
			S: '#forge:string',
			F: '#forge:flint',
			C: '#forge:cobblestone',
			P: '#minecraft:planks'			
		}).id('vulpinian_skies_core:eoka_pistol');

	event.remove ({id:'scorchedguns:pipe_musket'})
	event.shaped('scorchedguns:pipe_musket', [
			'FS ',
			'CCC',
			'P  '
			], {						
			S: '#forge:string',
			F: '#forge:flint',
			C: '#forge:cobblestone',
			P: '#minecraft:planks'	
		}).id('vulpinian_skies_core:pipe_musket');

	event.remove ({id:'scorchedguns:noqq_gun'})
	event.shaped('scorchedguns:noqq_gun', [
			' CC',
			'FSC',
			'PCC'
			], {						
			S: '#forge:string',
			F: '#forge:flint',
			C: '#forge:cobblestone',
			P: '#minecraft:planks'	
		}).id('vulpinian_skies_core:noqq_gun');
	

	//Class F Guns
	
	event.remove ({id:'scorchedguns:hand_crossbow'})
	event.shaped('scorchedguns:hand_crossbow', [
			'RR ',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_f_frame',						
			C: '#forge:ingots/cast_iron',
			R: 'scorchedguns:rivet',
			S: '#forge:string'
		}).id('vulpinian_skies_core:hand_crossbow');

	event.remove ({id:'scorchedguns:auto_crossbow'})
	event.shaped('scorchedguns:auto_crossbow', [
			'RR ',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_f_frame',						
			C: '#forge:ingots/cast_iron',
			R: 'scorchedguns:rivet',
			S: 'createbigcannons:spring_wire'
		}).id('vulpinian_skies_core:auto_crossbow')
	
	event.remove ({id:'scorchedguns:scrap_cannon'})
	event.shaped('scorchedguns:scrap_cannon', [
			'   ',
			'LCC',
			'FP '
			], {						
			F: 'vulpinian_skies_core:class_f_frame',						
			C: '#forge:ingots/cast_iron',
			L: '#forge:flint',
			P: '#minecraft:planks'
		}).id('vulpinian_skies_core:scrap_cannon');
	
	event.remove ({id:'scorchedguns:blunderbuss'})
	event.shaped('scorchedguns:blunderbuss', [
			' CC',
			'LCC',
			'FP '
			], {						
			F: 'vulpinian_skies_core:class_f_frame',						
			C: '#forge:ingots/cast_iron',
			L: '#forge:flint',
			P: '#minecraft:planks'
		}).id('vulpinian_skies_core:blunderbuss');
	
	event.remove ({id:'scorchedguns:bastard_gun'})
	event.shaped('scorchedguns:bastard_gun', [
			'L  ',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_f_frame',						
			C: '#forge:ingots/cast_iron',
			L: '#forge:flint',
			S: 'createbigcannons:spring_wire'
		}).id('vulpinian_skies_core:bastard_gun');
	
	event.remove ({id:'scorchedguns:scrap_pistol'})
	event.shaped('scorchedguns:scrap_pistol', [
			'   ',
			'LCN',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_f_frame',						
			C: '#forge:ingots/cast_iron',
			N: '#forge:nuggets/cast_iron',
			L: '#forge:flint',			
		}).id('vulpinian_skies_core:scrap_pistol');
	
	event.remove ({id:'scorchedguns:riveter'})
	event.shaped('scorchedguns:riveter', [
			' O ',
			'SCN',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_f_frame',						
			C: '#forge:ingots/brass',
			O: '#forge:cogwheels',
			N: '#forge:nuggets/brass',
			S: 'createbigcannons:spring_wire'
		}).id('vulpinian_skies_core:riveter');

	//Class E guns
	
	event.remove ({id:'scorchedguns:flechette_jet'})
	event.shaped('scorchedguns:flechette_jet', [
			'RCC',
			'LCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_e_frame',						
			C: '#forge:ingots/cast_iron',
			L: '#forge:flint',
			R: 'scorchedguns:rivet'
		}).id('vulpinian_skies_core:flechette_jet');
		
	event.remove ({id:'scorchedguns:m12_waltz'})
	event.shaped('scorchedguns:m12_waltz', [
			'   ',
			'LCN',
			'FP '
			], {						
			F: 'vulpinian_skies_core:class_e_frame',						
			C: '#forge:ingots/cast_iron',
			N: '#forge:nuggets/cast_iron',
			L: '#forge:flint',
			P: '#minecraft:planks'
		}).id('vulpinian_skies_core:m12_waltz');
		
	event.remove ({id:'scorchedguns:jury_rigged_wrist_breaker'})
	event.shaped('scorchedguns:jury_rigged_wrist_breaker', [
			' O ',
			'SCN',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_e_frame',						
			C: '#forge:ingots/brass',
			O: '#forge:cogwheels',
			N: '#forge:nuggets/brass',
			S: 'createbigcannons:spring_wire'
		}).id('vulpinian_skies_core:jury_rigged_wrist_breaker');
		
	event.remove ({id:'scorchedguns:railworker'})
	event.shaped('scorchedguns:railworker', [
			' ON',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_e_frame',						
			C: '#forge:ingots/brass',
			O: '#forge:cogwheels',
			N: '#forge:nuggets/cast_iron',
			S: 'createbigcannons:spring_wire'
		}).id('vulpinian_skies_core:railworker');
		
	event.remove ({id:'scorchedguns:jackhammer'})
	event.shaped('scorchedguns:jackhammer', [
			'COC',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_e_frame',						
			C: '#forge:ingots/brass',
			O: '#forge:cogwheels',			
			S: 'createbigcannons:spring_wire'
		}).id('vulpinian_skies_core:jackhammer');
		
	event.remove ({id:'scorchedguns:thumper'})
	event.shaped('scorchedguns:thumper', [
			'   ',
			'SCN',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_e_frame',						
			C: '#forge:ingots/brass',			
			N: '#forge:nuggets/brass',
			S: 'create:propeller'
		}).id('vulpinian_skies_core:thumper');
		
	//Class D guns
	
	event.remove ({id:'cgm:pistol'})
	event.shaped('cgm:pistol', [
			'   ',
			'SCN',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:ingots/brass',			
			N: '#forge:nuggets/brass',
			S: 'createbigcannons:spring_wire'
		}).id('vulpinian_skies_core:pistol');
		
	event.remove ({id:'cgm:shotgun'})
	event.shaped('cgm:shotgun', [
			' O ',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:ingots/brass',
			O: '#forge:cogwheels',
			S: 'createbigcannons:spring_wire',			
		}).id('vulpinian_skies_core:shotgun');
		
	event.remove ({id:'cgm:rifle'})
	event.shaped('cgm:rifle', [
			' ON',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:ingots/brass',
			O: '#forge:cogwheels',
			S: 'createbigcannons:spring_wire',
			N: '#forge:nuggets/brass'
		}).id('vulpinian_skies_core:rifle');
		
	event.remove ({id:'cgm:mini_gun'})
	event.shaped('cgm:mini_gun', [
			'OOI',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:storage_blocks/brass',
			O: '#forge:cogwheels',			
			S: 'createbigcannons:spring_wire',
			I: '#forge:ingots/brass'
		}).id('vulpinian_skies_core:mini_gun');
		
	event.remove ({id:'cgm:assault_rifle'})
	event.shaped('cgm:assault_rifle', [
			' O ',
			'SCC',
			'FI '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:ingots/brass',
			O: '#forge:cogwheels',
			S: 'createbigcannons:spring_wire',
			I: '#forge:ingots/cast_iron'
		}).id('vulpinian_skies_core:assault_rifle');
		
	event.remove ({id:'cgm:machine_pistol'})
	event.shaped('cgm:machine_pistol', [
			'   ',
			'SCN',
			'FO '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:ingots/brass',			
			N: '#forge:nuggets/brass',
			S: 'createbigcannons:spring_wire',
			O: '#forge:cogwheels'
		}).id('vulpinian_skies_core:machine_pistol');
		
	event.remove ({id:'cgm:heavy_rifle'})
	event.shaped('cgm:heavy_rifle', [
			' OC',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:ingots/brass',
			O: '#forge:cogwheels',
			S: 'createbigcannons:spring_wire',			
		}).id('vulpinian_skies_core:heavy_rifle');
		
	event.remove ({id:'scorchedguns:waltz_conversion'})
	event.shaped('scorchedguns:waltz_conversion', [
			'   ',
			'SCN',
			'FN '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:ingots/cast_iron',
			N: '#forge:nuggets/cast_iron',
			S: 'createbigcannons:spring_wire',			
		}).id('vulpinian_skies_core:waltz_conversion');
		
	event.remove ({id:'scorchedguns:steyr_smg'})
	event.shaped('scorchedguns:steyr_smg', [
			'   ',
			'SCC',
			'FN '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:ingots/cast_iron',
			N: '#forge:nuggets/cast_iron',
			S: 'createbigcannons:spring_wire',			
		}).id('vulpinian_skies_core:steyr_smg');
		
	event.remove ({id:'scorchedguns:scattergun'})
	event.shaped('scorchedguns:scattergun', [
			'   ',
			'SCC',
			'FN '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:ingots/cast_iron',
			N: '#forge:flint',
			S: 'createbigcannons:spring_wire',			
		}).id('vulpinian_skies_core:scattergun');
		
	event.remove ({id:'scorchedguns:carabine_44'})
	event.shaped('scorchedguns:carabine_44', [
			' CC',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:ingots/cast_iron',			
			S: 'createbigcannons:spring_wire',			
		}).id('vulpinian_skies_core:carabine_44');
		
	event.remove ({id:'scorchedguns:g19_director'})
	event.shaped('scorchedguns:g19_director', [
			' CC',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:ingots/cast_iron',			
			S: 'create:propeller',			
		}).id('vulpinian_skies_core:g19_director');
		
	event.remove ({id:'scorchedguns:m19_waltz_dehann'})
	event.shaped('scorchedguns:m19_waltz_dehann', [
			'   ',
			'SCN',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:ingots/cast_iron',
			N: '#forge:nuggets/cast_iron',
			S: 'createbigcannons:spring_wire',			
		}).id('vulpinian_skies_core:m19_waltz_dehann');
		
	event.remove ({id:'scorchedguns:volley_gun'})
	event.shaped('scorchedguns:volley_gun', [
			'OCC',
			'SCC',
			'FN '
			], {						
			F: 'vulpinian_skies_core:class_d_frame',						
			C: '#forge:storage_blocks/copper',
			N: 'create:copper_backtank',
			S: 'create:propeller',
			O: '#forge:cogwheels'
		}).id('vulpinian_skies_core:volley_gun');
	
	//Class C Guns
	
	//Liquid Quartz Recipes, apart from Tinkers, to do it wit Create, as it is needed for the frame for this tier
	event.custom({
		  "type": "createbigcannons:melting",
		  "ingredients": [
			{
			  "tag": "vulpinian_skies_core:quartz_blocks/full"
			}
		  ],
		  "results": [
			{
			  "fluid": "tconstruct:molten_quartz",
			  "amount": 400
			}
		  ],
		  "processingTime": 800,
		  "heatRequirement": "heated"		  
		}
	)
	
	event.custom({
		  "type": "createbigcannons:melting",
		  "ingredients": [
			{
			  "tag": "vulpinian_skies_core:quartz_blocks/three_fourths"
			}
		  ],
		  "results": [
			{
			  "fluid": "tconstruct:molten_quartz",
			  "amount": 300
			}
		  ],
		  "processingTime": 600,
		  "heatRequirement": "heated",		  
		}
	)
	
	event.custom({
		  "type": "createbigcannons:melting",
		  "ingredients": [
			{
			  "tag": "vulpinian_skies_core:quartz_blocks/half"
			}
		  ],
		  "results": [
			{
			  "fluid": "tconstruct:molten_quartz",
			  "amount": 200
			}
		  ],
		  "processingTime": 400,
		  "heatRequirement": "heated",		  
		}
	)
	
	event.custom({
		  "type": "createbigcannons:melting",
		  "ingredients": [
			{
			  "tag": "vulpinian_skies_core:quartz_blocks/one_fourth"
			}
		  ],
		  "results": [
			{
			  "fluid": "tconstruct:molten_quartz",
			  "amount": 100
			}
		  ],
		  "processingTime": 200,
		  "heatRequirement": "heated",		  
		}
	)
		
	event.remove ({id:'scorchedguns:scorched_wand'})
	event.shaped('scorchedguns:scorched_wand', [
			' WW',
			'SCN',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',
			N: 'scorchedguns:scorched_bronze_nugget',
			S: 'createbigcannons:spring_wire',
			W: '#minecraft:wooden_slabs'
		}).id('vulpinian_skies_core:scorched_wand');
		
	event.remove ({id:'scorchedguns:scorched_staff'})
	event.shaped('scorchedguns:scorched_staff', [
			' WW',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',			
			S: 'createbigcannons:spring_wire',
			W: '#minecraft:wooden_slabs'
		}).id('vulpinian_skies_core:scorched_staff');
		
	event.remove ({id:'scorchedguns:scorched_obrez'})
	event.shaped('scorchedguns:scorched_obrez_staff', [
			' WW',
			'SCN',
			'FN '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',
			N: 'scorchedguns:scorched_bronze_nugget',
			S: 'createbigcannons:spring_wire',
			W: '#minecraft:wooden_slabs'
		}).id('vulpinian_skies_core:scorched_obrez');
		
	event.remove ({id:'scorchedguns:scorched_scatter_staff'})
	event.shaped('scorchedguns:scorched_scatter_staff', [
			' WW',
			'SCC',
			'FL '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',			
			S: 'createbigcannons:spring_wire',
			W: '#minecraft:wooden_slabs',
			L: '#forge:flint'
		}).id('vulpinian_skies_core:scorched_scatter_staff');
		
	event.remove ({id:'scorchedguns:blasphemy'})
	event.shaped('scorchedguns:blasphemy', [
			'   ',
			' N ',
			'FS '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',			
			S: 'create:blaze_burner',			
			N: 'createbigcannons:nethersteel_nugget'
		}).id('vulpinian_skies_core:blasphemy');
		
	event.remove ({id:'scorchedguns:sc_gowza'})
	event.shaped('scorchedguns:sc_gowza', [
			' WW',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',			
			S: 'createbigcannons:spring_wire',
			W: '#forge:ingots/cast_iron'
		}).id('vulpinian_skies_core:sc_gowza');
		
	event.remove ({id:'scorchedguns:gowza_32l'})
	event.shaped('scorchedguns:gowza_32l', [
			' WW',
			'SCC',
			'FN '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',
			N: 'scorchedguns:scorched_bronze_nugget',
			S: 'createbigcannons:spring_wire',
			W: '#forge:ingots/cast_iron'
		}).id('vulpinian_skies_core:gowza_32l');
		
	event.remove ({id:'scorchedguns:frontier_sidearm'})
	event.shaped('scorchedguns:frontier_sidearm', [
			' WW',
			'SCN',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',
			N: 'scorchedguns:scorched_bronze_nugget',
			S: 'createbigcannons:spring_wire',
			W: '#forge:nuggets/cast_iron'
		}).id('vulpinian_skies_core:frontier_sidearm');
		
	event.remove ({id:'scorchedguns:sc_deputy'})
	event.shaped('scorchedguns:sc_deputy', [
			' WW',
			'SCN',
			'FL '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',
			N: 'scorchedguns:scorched_bronze_nugget',
			S: 'createbigcannons:spring_wire',
			W: '#forge:nuggets/cast_iron',
			L: '#forge:flint'
		}).id('vulpinian_skies_core:sc_deputy');
		
	event.remove ({id:'scorchedguns:sc_lawbringer'})
	event.shaped('scorchedguns:sc_lawbringer', [
			' WW',
			'SCC',
			'FL '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',			
			S: 'createbigcannons:spring_wire',
			W: '#forge:nuggets/cast_iron',
			L: '#forge:flint'
		}).id('vulpinian_skies_core:sc_lawbringer');
		
	event.remove ({id:'scorchedguns:lm_scoont'})
	event.shaped('scorchedguns:lm_scoont', [
			' WW',
			'SCC',
			'FW '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: '#forge:ingots/cast_iron',			
			S: 'createbigcannons:spring_wire',
			W: '#forge:nuggets/cast_iron',			
		}).id('vulpinian_skies_core:lm_scoont');
		
	event.remove ({id:'scorchedguns:lm_sekora'})
	event.shaped('scorchedguns:lm_sekora', [
			'   ',
			'SCC',
			'FW '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: '#forge:ingots/cast_iron',			
			S: 'createbigcannons:spring_wire',
			W: '#forge:flint',			
		}).id('vulpinian_skies_core:lm_sekora');
		
	event.remove ({id:'scorchedguns:lm_spear_trough'})
	event.shaped('scorchedguns:lm_spear_trough', [
			'W  ',
			'SCC',
			'FW '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: '#forge:ingots/cast_iron',			
			S: 'createbigcannons:spring_wire',
			W: '#forge:nuggets/cast_iron',			
		}).id('vulpinian_skies_core:lm_spear_trough');
		
	event.remove ({id:'scorchedguns:lm_spear_ironport'})
	event.shaped('scorchedguns:lm_spear_ironport', [
			'WWW',
			'SCC',
			'FW '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: '#forge:ingots/cast_iron',			
			S: 'createbigcannons:spring_wire',
			W: '#forge:nuggets/cast_iron',			
		}).id('vulpinian_skies_core:lm_spear_ironport');
		
	event.remove ({id:'scorchedguns:ooz_96'})
	event.shaped('scorchedguns:ooz_96', [
			'   ',
			'SCW',
			'FC '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: '#forge:ingots/cast_iron',			
			S: 'createbigcannons:spring_wire',
			W: '#forge:nuggets/cast_iron',			
		}).id('vulpinian_skies_core:ooz_96');
		
	event.remove ({id:'cgm:grenade_launcher'})
	event.shaped('cgm:grenade_launcher', [
			' O ',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: '#forge:ingots/brass',			
			S: 'create:propeller',
			O: '#forge:cogwheels'
		}).id('vulpinian_skies_core:grenade_launcher');
		
	event.remove ({id:'scorchedguns:invis_nvr_63'})
	event.shaped('scorchedguns:invis_nvr_63', [
			'IWW',
			'SCN',
			'FL '
			], {						
			F: 'vulpinian_skies_core:class_c_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',			
			S: 'createbigcannons:spring_wire',
			W: 'minecraft:crimson_slab',
			N: 'scorchedguns:scorched_bronze_nugget',
			L: '#forge:ingots/gold',
			I: 'createbigcannons:nethersteel_ingot'
		}).id('vulpinian_skies_core:invis_nvr_63');
		
	event.remove ({id:'scorchedguns:skellik_65'})
	event.shaped('scorchedguns:skellik_65', [
			'IWW',
			'SCC',
			'FL '
			], {
			F: 'vulpinian_skies_core:class_c_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',			
			S: 'createbigcannons:spring_wire',
			W: 'minecraft:crimson_slab',		
			L: '#forge:ingots/gold',
			I: 'createbigcannons:nethersteel_ingot'
		}).id('vulpinian_skies_core:skellik_65');
		
		
	//Class B Guns
	
	event.remove ({id:'scorchedguns:sc_fusilage'})
	event.shaped('scorchedguns:sc_fusilage', [
			' WW',
			'SCC',
			'FW '
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',			
			S: 'createbigcannons:spring_wire',
			W: 'createbigcannons:nethersteel_nugget'
		}).id('vulpinian_skies_core:sc_fusilage');
		
	event.remove ({id:'scorchedguns:sc_dahka'})
	event.shaped('scorchedguns:sc_dahka', [
			' WW',
			'SCC',
			'FL '
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',			
			S: 'createbigcannons:spring_wire',
			W: 'createbigcannons:nethersteel_nugget',
			L: '#forge:ingots/netherite'
		}).id('vulpinian_skies_core:sc_dahka');
		
	event.remove ({id:'scorchedguns:soul_drummer'})
	event.shaped('scorchedguns:soul_drummer', [
			' WW',
			'SCC',
			'FL '
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: '#forge:ingots/cobalt',
			S: 'createbigcannons:spring_wire',
			W: 'createbigcannons:nethersteel_nugget',
			L: '#forge:ingots/netherite'
		}).id('vulpinian_skies_core:soul_drummer');

	event.remove ({id:'cgm:bazooka'})
	event.shaped('cgm:bazooka', [
			'OCC',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: '#forge:storage_blocks/brass',
			S: 'create:propeller',
			O: '#forge:cogwheels'
		}).id('vulpinian_skies_core:bazooka');
		
	event.remove ({id:'scorchedguns:gauss_rifle'})
	event.shaped('scorchedguns:gauss_rifle', [
			'OUU',
			'SCC',
			'FDD'
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: '#forge:ingots/brass',
			S: 'createaddition:alternator',
			O: '#forge:cogwheels',
			U: '#forge:wires/gold',
			D: '#forge:wires/copper'
		}).id('vulpinian_skies_core:gauss_rifle');
		
	event.remove ({id:'scorchedguns:cogloader'})
	event.shaped('scorchedguns:cogloader', [
			'OC ',
			'SCC',
			'F L'
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: '#forge:ingots/netherite',
			S: 'createaddition:electric_motor',
			O: '#forge:cogwheels',
			L: '#forge:ingots/brass'
		}).id('vulpinian_skies_core:cogloader');
		
	event.remove ({id:'scorchedguns:m99_krauser'})
	event.shaped('scorchedguns:m99_krauser', [
			'   ',
			'SCN',
			'FN '
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: '#forge:ingots/brass',
			S: 'createbigcannons:spring_wire',
			N: '#forge:nuggets/brass'
		}).id('vulpinian_skies_core:m99_krauser');
		
	event.remove ({id:'scorchedguns:krauser_conversion'})
	event.shaped('scorchedguns:krauser_conversion', [
			'   ',
			'SCC',
			'FNN'
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: '#forge:ingots/brass',
			S: 'createbigcannons:spring_wire',
			N: '#forge:nuggets/cast_iron'
		}).id('vulpinian_skies_core:krauser_conversion');
		
	event.remove ({id:'scorchedguns:osgood_50'})
	event.shaped('scorchedguns:osgood_50', [
			'   ',
			'SCN',
			'FNN'
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: '#forge:ingots/brass',
			S: 'createbigcannons:spring_wire',
			N: '#forge:nuggets/brass'
		}).id('vulpinian_skies_core:osgood_50');
		
	event.remove ({id:'scorchedguns:huot_auto'})
	event.shaped('scorchedguns:huot_auto', [
			'ONN',
			'SCC',
			'FIC'
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: '#forge:ingots/brass',
			S: 'createbigcannons:spring_wire',
			N: '#forge:nuggets/netherite',
			O: '#forge:cogwheels',
			I: '#forge:ingots/netherite'
		}).id('vulpinian_skies_core:huot_auto');
		
	event.remove ({id:'scorchedguns:spitfire'})
	event.shaped('scorchedguns:spitfire', [
			'OCI',
			'SCC',
			'FI '
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: '#forge:storage_blocks/brass',
			S: 'create:propeller',			
			O: '#forge:cogwheels',
			I: '#forge:ingots/netherite',
		}).id('vulpinian_skies_core:spitfire');
		
	event.remove ({id:'scorchedguns:kiln_gun'})
	event.shaped('scorchedguns:kiln_gun', [
			' CC',
			'SCC',
			'FN '
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: '#forge:storage_blocks/cast_iron',
			S: 'createbigcannons:spring_wire',
			N: '#forge:flint'
		}).id('vulpinian_skies_core:kiln_gun');
		
	event.remove ({id:'scorchedguns:punt_gun'})
	event.shaped('scorchedguns:punt_gun', [
			'NII',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',
			S: 'createbigcannons:spring_wire',
			I: '#forge:plates/netherite',
			N: '#forge:nuggets/netherite'
		}).id('vulpinian_skies_core:punt_gun');
		
	event.remove ({id:'scorchedguns:tt_jorm_keg'})
	event.shaped('scorchedguns:tt_jorm_keg', [
			'IWW',
			'SCC',
			'FL '
			], {
			F: 'vulpinian_skies_core:class_b_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',			
			S: 'createbigcannons:spring_wire',
			W: 'minecraft:crimson_slab',		
			L: '#forge:ingots/gold',
			I: 'createbigcannons:nethersteel_ingot'
		}).id('vulpinian_skies_core:tt_jorm_keg');
		
	event.remove ({id:'scorchedguns:tunck_37'})
	event.shaped('scorchedguns:tunck_37', [
			'IWW',
			'SCN',
			'FL '
			], {						
			F: 'vulpinian_skies_core:class_b_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',			
			S: 'createbigcannons:spring_wire',
			W: 'minecraft:crimson_slab',
			N: 'scorchedguns:scorched_bronze_nugget',
			L: '#forge:ingots/gold',
			I: 'createbigcannons:nethersteel_ingot'
		}).id('vulpinian_skies_core:tunck_37');
		
	//Class A Guns
	
	event.remove ({id:'scorchedguns:thunderhead'})
	event.shaped('scorchedguns:thunderhead', [
			'BCI',
			'SCC',
			'FL '
			], {						
			F: 'vulpinian_skies_core:class_a_frame',						
			C: '#forge:storage_blocks/brass',
			S: 'createaddition:electric_motor',
			B: '#forge:storage_blocks/netherite',		
			L: 'minecraft:yellow_shulker_box',
			I: '#forge:ingots/netherite'
		}).id('vulpinian_skies_core:thunderhead');
		
	event.remove ({id:'scorchedguns:vidas_smg'})
	event.shaped('scorchedguns:vidas_smg', [
			'WII',
			'SCC',
			'FL '
			], {
			F: 'vulpinian_skies_core:class_a_frame',						
			C: 'scorchedguns:scorched_bronze_ingot',			
			S: 'createbigcannons:spring_wire',
			W: 'minecraft:crimson_slab',		
			L: '#forge:ingots/gold',
			I: '#forge:ingots/netherite'
		}).id('vulpinian_skies_core:vidas_smg');
		
	event.remove ({id:'scorchedguns:cyclone'})
	event.shaped('scorchedguns:cyclone', [
			'ICC',
			'SBC',
			'FL '
			], {						
			F: 'vulpinian_skies_core:class_a_frame',						
			C: '#forge:storage_blocks/brass',
			S: 'createaddition:electric_motor',
			B: '#forge:storage_blocks/netherite',		
			L: 'sophisticatedbackpacks:backpack',
			I: 'create:propeller'
		}).id('vulpinian_skies_core:cyclone');
		
	//Class S Guns

	event.remove ({id:'scorchedguns:officers_special'})
	event.shaped('scorchedguns:officers_special', [
			' WW',
			'SCN',
			'FW '
			], {						
			F: 'vulpinian_skies_core:class_s_frame',						
			C: '#forge:ingots/forgotten_metal',
			N: '#forge:nuggets/forgotten_metal',
			S: 'createbigcannons:spring_wire',
			W: '#forge:nuggets/netherite'
		}).id('vulpinian_skies_core:officers_special');
		
	event.remove ({id:'scorchedguns:cosmic_blitzer'})
	event.shaped('scorchedguns:cosmic_blitzer', [
			' WW',
			'SCN',
			'FA '
			], {						
			F: 'vulpinian_skies_core:class_s_frame',						
			C: '#forge:ingots/forgotten_metal',
			N: '#forge:nuggets/forgotten_metal',
			S: 'createbigcannons:spring_wire',
			W: '#forge:nuggets/netherite',
			A: '#forge:nuggets/cast_iron'
		}).id('vulpinian_skies_core:cosmic_blitzer');
		
	event.remove ({id:'scorchedguns:r498_gauss_cannon'})
	event.shaped('scorchedguns:r498_gauss_cannon', [
			'OUU',
			'SCC',
			'FDD'
			], {						
			F: 'vulpinian_skies_core:class_s_frame',						
			C: '#forge:ingots/forgotten_metal',
			S: 'createaddition:alternator',
			O: '#forge:cogwheels',
			U: '#forge:wires/gold',
			D: '#forge:wires/copper'
		}).id('vulpinian_skies_core:r498_gauss_cannon');
		
	event.remove ({id:'scorchedguns:alfonz_repeating_punter'})
	event.shaped('scorchedguns:alfonz_repeating_punter', [
			' NN',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_s_frame',						
			C: '#forge:ingots/forgotten_metal',
			N: '#forge:nuggets/forgotten_metal',
			S: '#forge:flint'			
		}).id('vulpinian_skies_core:alfonz_repeating_punter');
		
	event.remove ({id:'scorchedguns:alfonz_turnpike'})
	event.shaped('scorchedguns:alfonz_turnpike', [
			'PNN',
			'SCC',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_s_frame',						
			C: '#forge:ingots/forgotten_metal',
			N: '#forge:nuggets/forgotten_metal',
			S: '#forge:flint',
			P: '#forge:cogwheels'
		}).id('vulpinian_skies_core:alfonz_turnpike');
		
	event.remove ({id:'scorchedguns:lg8_grenade_launcher'})
	event.shaped('scorchedguns:lg8_grenade_launcher', [
			'CCC',
			'SPC',
			'F N'
			], {						
			F: 'vulpinian_skies_core:class_s_frame',						
			C: '#forge:ingots/forgotten_metal',
			N: '#forge:nuggets/netherite',
			S: 'create:propeller',
			P: '#forge:storage_blocks/forgotten_metal'
		}).id('vulpinian_skies_core:lg8_grenade_launcher');
		
	event.remove ({id:'scorchedguns:astella'})
	event.shaped('scorchedguns:astella', [
			'OWW',
			'SCW',
			'F  '
			], {						
			F: 'vulpinian_skies_core:class_s_frame',						
			C: '#forge:ingots/forgotten_metal',			
			S: 'createbigcannons:spring_wire',
			W: '#forge:ingots/netherite',
			O: '#forge:cogwheels'
		}).id('vulpinian_skies_core:astella');
		
	event.remove ({id:'scorchedguns:earths_corpse'})
	event.shaped('scorchedguns:earths_corpse', [
			' OW',
			'SCN',
			'FO '
			], {						
			F: 'vulpinian_skies_core:class_s_frame',						
			C: '#forge:ingots/forgotten_metal',
			N: '#forge:ingots/netherite',
			S: 'createbigcannons:spring_wire',
			W: '#forge:nuggets/netherite',
			O: '#forge:nuggets/forgotten_metal'
		}).id('vulpinian_skies_core:earths_corpse');
		
	
	//Misc Recipes
	
	//Custom, more expensive waystone recipes	
	event.remove({id:'waystones:warp_stone'})
	event.shaped('waystones:warp_stone', [
		'SPS',
		'DED',
		'SBS'
		], {
		P: 'hexcasting:dye_colorizer_purple',
		E: 'minecraft:ender_pearl',
		B: 'minecraft:emerald_block',
		S: 'minecraft:smooth_stone',
		D: 'minecraft:diamond'
	})
	
	event.custom (
	{
	  "type": "ars_nouveau:imbuement",
	  "input": {
		"item": "create_confectionery:gingerdough"
	  },
	  "output": "create_confectionery:little_gingerbread_man_spawn_egg",
	  "count": 1,
	  "source": 1000,
	  "pedestalItems": [
		{
		  "item": {
			"item": "ars_nouveau:conjuration_essence"
		  }
		},
		{
		  "item": {
			"item": "ars_nouveau:manipulation_essence"
		  }
		},
		{
		  "item": {
			"item": "ars_nouveau:air_essence"
		  }
		}
	  ]
	});
		
	//BASIN MELTING RECIPES USING CBC
	function createBasinMelting(event, input, inputIsTag, output, amount, superHeated) {
		
		let inputType = inputIsTag ? "tag" : "item";
		let ingredientEntry = JSON.parse(`{"${inputType}": "${input}"}`);
		
		event.custom({
			  "type": "createbigcannons:melting",
			  "ingredients": [
				  ingredientEntry				
			  ],
			  "results": [
				{
				  "fluid": output,
				  "amount": amount
				}
			  ],
			  "processingTime": (amount * 2),
			  "heatRequirement": (superHeated ? "superheated" : "heated")
			}
		);
	}
	
	function createBasinMeltingDouble(event, input, inputIsTag, output, amount, output2, amount2, superHeated) {
		
		let inputType = inputIsTag ? "tag" : "item";
		let ingredientEntry = JSON.parse(`{"${inputType}": "${input}"}`);
		
		event.custom({
			  "type": "createbigcannons:melting",
			  "ingredients": [
				  ingredientEntry				
			  ],
			  "results": [
				{
				  "fluid": output,
				  "amount": amount
				},
				{
				  "fluid": output2,
				  "amount": amount2
				}
			  ],
			  "processingTime": (amount * 2),
			  "heatRequirement": (superHeated ? "superheated" : "heated")
			}
		);
	}
	
	function createBasinMeltingOre(event, input, inputIsTag, output, amount, lavaAmount, xpAmount) {
		
		let inputType = inputIsTag ? "tag" : "item";
		let ingredientEntry = JSON.parse(`{"${inputType}": "${input}"}`);
		let processingTime = Math.floor(amount * 0.75);		
		let lavaEntry;
		
		if (lavaAmount > 0) {
			lavaEntry = JSON.parse(`{"fluid": "minecraft:lava", "amount": ${lavaAmount}}`);
			
			event.custom({
				  "type": "createbigcannons:melting",
				  "ingredients": [
					  ingredientEntry				
				  ],
				  "results": [
					{
					  "fluid": output,
					  "amount": amount
					},
					  lavaEntry,
					{
					  "item": "create:experience_nugget",
					  "count": xpAmount,
					  "chance": 0.75
					}			
				  ],
				  "processingTime": processingTime,
				  "heatRequirement": "heated"
				}
			);
		} else {
			lavaEntry = 0;
			
			event.custom({
				  "type": "createbigcannons:melting",
				  "ingredients": [
					  ingredientEntry				
				  ],
				  "results": [
					{
					  "fluid": output,
					  "amount": amount
					},					  
					{
					"fluid": "create_enchantment_industry:experience",
					"amount": xpAmount
					}			
				  ],
				  "processingTime": processingTime,
				  "heatRequirement": "heated"
				}
			);
		}
		
	}
	
	
	
	const moltenIronMap = new Map([
		[
			'minecraft:raw_iron',
			[90, 0, 2]
		],
		[
			'minecraft:iron_ore',
			[135, 100, 1]
		],
		[
			'minecraft:deepslate_iron_ore',
			[225, 150, 1]
		],
		[
			'minecraft:raw_iron_block',
			[810, 0, 23]
		],
		[
			'undergarden:depthrock_iron_ore',
			[360, 200, 4]
		],
		[
			'undergarden:shiverstone_iron_ore',
			[360, 200, 4]
		],
		[
			'create:stone_types/crimsite',
			[40, 0, 2, true]
		]
	]);
	
	const moltenGoldMap = new Map([
		[
			'minecraft:raw_gold',
			[90, 0, 4]
		],
		[
			'minecraft:gold_ore',
			[135, 100, 2]
		],
		[
			'minecraft:deepslate_gold_ore',
			[225, 150, 2]
		],
		[
			'minecraft:raw_gold_block',
			[810, 0, 46]
		],
		[
			'minecraft:nether_gold_ore',
			[180, 100, 1]
		],
		[
			'undergarden:depthrock_gold_ore',
			[360, 200, 4]
		],
		[
			'create:stone_types/ochrum',
			[20, 0, 2, true]
		]
	]);
	
	const moltenEmeraldMap = new Map([
		[
			'minecraft:emerald_ore',
			[150, 100, 1]
		],
		[
			'minecraft:deepslate_emerald_ore',
			[250, 150, 1]
		],		
		[
			'byg:emeraldite_ore',
			[50, 100, 1]
		],
		[
			'gemsnjewels:v_emerald_nether_ore_block',
			[150, 100, 1]
		],
		[
			'gemsnjewels:emerald_ore_block',
			[150, 100, 1]
		],
		[
			'gemsnjewels:emerald_deepslate_ore_block',
			[250, 150, 1]
		],
		[
			'gemsnjewels:emerald_nether_ore_block',
			[150, 100, 1]
		]
	]);
	
	const moltenCopperMap = new Map([
		[
			'minecraft:raw_copper',
			[90, 0, 2]
		],
		[
			'minecraft:copper_ore',
			[495, 100, 1]
		],
		[
			'minecraft:deepslate_copper_ore',
			[675, 150, 1]
		],
		[
			'minecraft:raw_copper_block',
			[810, 0, 23]
		],
		[
			'iceandfire:copper_ore',
			[495, 100, 1]
		],
		[
			'create:stone_types/veridium',
			[60, 0, 2, true]
		]
	]);
	
	const moltenZincMap = new Map([
		[
			'create:raw_zinc',
			[90, 0, 2]
		],
		[
			'create:zinc_ore',
			[135, 100, 1]
		],
		[
			'create:deepslate_zinc_ore',
			[225, 150, 1]
		],
		[
			'create:raw_zinc_block',
			[810, 0, 23]
		],
		[
			'create:stone_types/asurine',
			[30, 0, 2, true]
		]
	]);
	
	const moltenSilverMap = new Map([
		[
			'iceandfire:silver_ore',
			[135, 100, 2]
		]		
	]);
	
	const moltenCobaltMap = new Map([
		[
			'tconstruct:cobalt_ore',
			[135, 100, 2]
		],
		[
			'tconstruct:raw_cobalt',
			[100, 0, 4]
		],
		[
			'tconstruct:raw_cobalt_block',
			[900, 0, 36]
		]
	]);
	
	const moltenAmethystMap = new Map([
		[
			'iceandfire:amythest_ore',
			[150, 100, 32]
		],
		[
			'gemsnjewels:amethyst_ore_block',
			[150, 100, 32]
		],
		[
			'gemsnjewels:amethyst_deepslate_ore_block',
			[250, 150, 64]
		],
		[
			'minecraft:small_amethyst_bud',
			[200, 0, 20]
		],
		[
			'minecraft:medium_amethyst_bud',
			[400, 0, 40]
		],
		[
			'minecraft:large_amethyst_bud',
			[600, 0, 60]
		],
		[
			'minecraft:amethyst_cluster',
			[800, 0, 80]
		]	
	]);
	
	const moltenQuartzMap = new Map([
		[
			'vulpinian_skies_core:ores/quartz',
			[250, 100, 3, true]
		],
		[
			'byg:raw_quartz_block',
			[400, 0, 8]
		],
		[
			'byg:quartz_crystal',
			[100, 0, 2]
		]
	]);
	
	const moltenDiamondMap = new Map([
		[
			'minecraft:diamond_ore',
			[150, 100, 1]
		],
		[
			'minecraft:deepslate_diamond_ore',
			[250, 150, 1]
		],
		[
			'gemsnjewels:pale_diamond_ore_block',
			[150, 100, 1]
		],
		[
			'gemsnjewels:pale_diamond_deepslate_ore_block',
			[250, 150, 1]
		],
		[
			'gemsnjewels:pale_diamond_nether_ore_block',
			[150, 100, 1]
		],
		[
			'gemsnjewels:diamond_nether_ore_block',
			[150, 100, 1]
		],
		[
			'undergarden:depthrock_diamond_ore',
			[400, 200, 4]
		],
		[
			'undergarden:shiverstone_diamond_ore',
			[400, 200, 4]
		]
	]);
	
	const moltenDebrisMap = new Map([
		[
			'forge:ores/netherite_scrap',
			[120, 200, 2, true]
		]
	]);

	//Basing ore recipes off create, where the yield is equal to the 100% guaranteed yield from Create + 50% of the yield that is 75% guaranteed
	//Experience is fluid for raw materials and is equal to 85% rounded, of the yield of experience nuggets with a 75% chance.
	//For stone like veridium, go with 60% guaranteed material of the 80% chance
	
	const basinMeltingMap = new Map([
		['tconstruct:molten_iron', moltenIronMap],		
		['tconstruct:molten_gold', moltenGoldMap],
		['tconstruct:molten_emerald', moltenEmeraldMap],
		['tconstruct:molten_copper', moltenCopperMap],
		['tconstruct:molten_zinc', moltenZincMap],
		['tconstruct:molten_silver', moltenSilverMap],
		['tconstruct:molten_cobalt', moltenCobaltMap],
		['tconstruct:molten_amethyst', moltenAmethystMap],
		['tconstruct:molten_quartz', moltenQuartzMap],
		['tconstruct:molten_diamond', moltenDiamondMap],
		['tconstruct:molten_debris', moltenDebrisMap]
	  
	]);

	for (let [output, nestedMap] of basinMeltingMap) {
		
      for (let [input, value] of nestedMap) {
        //console.log("Melting " + input + " to get an amount of " + value);
		let isInputTag = value[3];
		createBasinMeltingOre(event, input, isInputTag, output, value[0], value[1], value[2]);
      }		
	}
	
	/*
	event.custom({
				  "type": "createbigcannons:melting",
				  "ingredients": [
					{
					  "item": "minecraft:deepslate_iron_ore"
					}
				  ],
				  "results": [
					{
					  "fluid": "tconstruct:molten_iron",
					  "amount": 225
					},
					{
					  "fluid": "minecraft:lava",
					  "amount": 150
					},
					{
					  "item": "create:experience_nugget",
					  "count": 1,
					  "chance": 0.75
					}		
				  ],
				  "processingTime": 40,
				  "heatRequirement": "heated"
				}
			); */

	
	//Emeralds
	createBasinMelting(event, "forge:gems/emerald", true, "tconstruct:molten_emerald", 100, true);
	createBasinMelting(event, "forge:storage_blocks/emerald", 1, "tconstruct:molten_emerald", 900, 1);	
	createBasinMelting(event, "byg:emeraldite_shards", false, "tconstruct:molten_emerald", 20, true);	
	createBasinMelting(event, "forge:nuggets/emerald", true, "tconstruct:molten_emerald", 11, true);
	
	/* Ore handling has been abstracted
	event.custom({
		  "type": "createbigcannons:melting",
		  "ingredients": [
			{
			  "tag": "forge:ores/emerald"
			}
		  ],
		  "results": [
			{
			  "fluid": "tconstruct:molten_emerald",
			  "amount": 225
			},
			{
			  "fluid": "minecraft:lava",
			  "amount": 40
			},
			{
			  "fluid": "create_enchantment_industry:experience",
			  "amount": 2
			}			
		  ],
		  "processingTime": 534,
		  "heatRequirement": "superheated"		  
		}
	); */
	
	/*High specific to Tinkers, probably will skip these recipes, also for some reason is sorted first which might be confusing
	event.custom({
		  "type": "createbigcannons:melting",
		  "ingredients": [
			{
			  "item": "tconstruct:emerald_reinforcement"
			}
		  ],
		  "results": [
			{
			  "fluid": "tconstruct:molten_emerald",
			  "amount": 25
			},
			{
			  "fluid": "tconstruct:molten_obsidian",
			  "amount": 250
			}			
		  ],
		  "processingTime": 550,
		  "heatRequirement": "superheated"		  
		}
	);*/
	
	//Diamond
	event.remove({id:'grimoireofgaia:diamond_shard_to_diamond'});
	event.remove({id:'born_in_chaos_v1:diamond_thermite_shard_k'});
	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/diamond/fourth_of_gem", true, "tconstruct:molten_diamond", 25, true);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/diamond/one_gem", true, "tconstruct:molten_diamond", 100, true);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/diamond/two_gems", true, "tconstruct:molten_diamond", 200, true);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/diamond/three_gems", true, "tconstruct:molten_diamond", 300, true);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/diamond/four_gems", true, "tconstruct:molten_diamond", 400, true);	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/diamond/five_gems", true, "tconstruct:molten_diamond", 500, true);	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/diamond/seven_gems", true, "tconstruct:molten_diamond", 700, true);	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/diamond/eight_gems", true, "tconstruct:molten_diamond", 800, true);	
	createBasinMelting(event, "forge:storage_blocks/diamond", true, "tconstruct:molten_diamond", 900, true);	
	
	//Clay
	createBasinMelting(event, "minecraft:clay_ball", false, "tconstruct:molten_clay", 250, false);
	createBasinMelting(event, "forge:ingots/brick", true, "tconstruct:molten_clay", 250, false);
	createBasinMelting(event, "minecraft:brick_slab", false, "tconstruct:molten_clay", 500, false);
	createBasinMelting(event, "minecraft:flower_pot", false, "tconstruct:molten_clay", 750, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/clay_blocks", true, "tconstruct:molten_clay", 1000, false);
	
	//Glass
	createBasinMelting(event, "forge:glass", true, "tconstruct:molten_glass", 1000, false);
	createBasinMelting(event, "forge:sand", true, "tconstruct:molten_glass", 1000, false);
	createBasinMelting(event, "minecraft:glass_bottle", false, "tconstruct:molten_glass", 750, false);
	createBasinMelting(event, "forge:glass_panes", true, "tconstruct:molten_glass", 250, false);
	
	//Obsidian
	createBasinMelting(event, "forge:dusts/obsidian", true, "tconstruct:molten_obsidian", 250, true);
	createBasinMelting(event, "forge:obsidian", true, "tconstruct:molten_obsidian", 1000, true);
	createBasinMelting(event, "forge:chests/ender", true, "tconstruct:molten_obsidian", 1000, true);
	event.custom({
		  "type": "createbigcannons:melting",
		  "ingredients": [
			{
			  "fluid": "minecraft:water",
			  "amount": 50
			},
			{
			  "fluid": "minecraft:lava",
			  "amount": 100
			}
		  ],
		  "results": [
			{
			  "fluid": "tconstruct:molten_obsidian",
			  "amount": 100
			}			
		  ],
		  "processingTime": 32
		}
	);
	
	//Ender
	createBasinMelting(event, "forge:crops/chorusfruit", true, "tconstruct:molten_ender", 5, false);
	createBasinMelting(event, "forge:ender_pearls", true, "tconstruct:molten_ender", 250, false);
	createBasinMelting(event, "minecraft:ender_eye", false, "tconstruct:molten_ender", 250, false);
	createBasinMelting(event, "tconstruct:enderman_head", false, "tconstruct:molten_ender", 500, false);	
	createBasinMelting(event, "minecraft:dragon_head", false, "tconstruct:molten_ender", 1000, false);
	
	//Amethyst
	createBasinMelting(event, "forge:gems/amethyst", true, "tconstruct:molten_amethyst", 100, true);
	createBasinMelting(event, "forge:storage_blocks/amethyst", true, "tconstruct:molten_amethyst", 400, true);
	
	//Debris
	createBasinMelting(event, "forge:nuggets/netherite_scrap", true, "tconstruct:molten_debris", 10, true);
	createBasinMelting(event, "forge:ingots/netherite_scrap", true, "tconstruct:molten_debris", 90, true);
	//createBasinMelting(event, "forge:ores/netherite_scrap", true, "tconstruct:molten_debris", 120, true);
	
	//Iron
	event.remove({id:'iceandfire:chainmail_helmet'})
	event.remove({id:'iceandfire:chainmail_chestplate'})
	event.remove({id:'iceandfire:chainmail_leggings'})
	event.remove({id:'iceandfire:chainmail_boots'})
	event.remove({id:'buildersaddition:iron_rod'})
	
	event.replaceInput({}, 'buildersaddition:iron_rod', 'createaddition:iron_rod');
	event.replaceOutput({}, 'buildersaddition:iron_rod', 'createaddition:iron_rod');
	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/iron/anvil", true, "tconstruct:molten_iron", 2700, false);	
	createBasinMelting(event, "forge:storage_blocks/iron", true, "tconstruct:molten_iron", 810, false);
	
	createBasinMelting(event, "minecraft:iron_helmet", false, "tconstruct:molten_iron", 450, false);
	createBasinMelting(event, "minecraft:chainmail_helmet", false, "tconstruct:molten_iron", 450, false);
	createBasinMelting(event, "minecraft:iron_chestplate", false, "tconstruct:molten_iron", 720, false);
	createBasinMelting(event, "minecraft:chainmail_chestplate", false, "tconstruct:molten_iron", 720, false);
	createBasinMelting(event, "minecraft:iron_leggings", false, "tconstruct:molten_iron", 630, false);
	createBasinMelting(event, "minecraft:chainmail_leggings", false, "tconstruct:molten_iron", 630, false);
	createBasinMelting(event, "minecraft:iron_boots", false, "tconstruct:molten_iron", 360, false);
	createBasinMelting(event, "minecraft:chainmail_boots", false, "tconstruct:molten_iron", 360, false);	
	
	createBasinMelting(event, "minecraft:bucket", false, "tconstruct:molten_iron", 270, false);
	createBasinMelting(event, "minecraft:cauldron", false, "tconstruct:molten_iron", 630, false);
	createBasinMelting(event, "minecraft:chain", false, "tconstruct:molten_iron", 110, false);
	createBasinMelting(event, "createdeco:iron_coin", false, "tconstruct:molten_iron", 90, false);
	createBasinMelting(event, "createdeco:iron_coinstack", false, "tconstruct:molten_iron", 720, false);
	createBasinMelting(event, "minecraft:crossbow", false, "tconstruct:molten_iron", 135, false);
	createBasinMelting(event, "minecraft:iron_horse_armor", false, "tconstruct:molten_iron", 630, false);		
	
	createBasinMelting(event, "forge:ingots/iron", true, "tconstruct:molten_iron", 90, false);
	createBasinMelting(event, "forge:plates/iron", true, "tconstruct:molten_iron", 90, false);
	createBasinMelting(event, "forge:rods/iron", true, "tconstruct:molten_iron", 45, false);
	createBasinMelting(event, "forge:wires/iron", true, "tconstruct:molten_iron", 45, false);	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/iron/three_nuggets", true, "tconstruct:molten_iron", 30, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/iron/lanterns", true, "tconstruct:molten_iron", 80, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/iron/one_ingot", true, "tconstruct:molten_iron", 90, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/iron/two_ingots", true, "tconstruct:molten_iron", 180, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/iron/three_ingots", true, "tconstruct:molten_iron", 270, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/iron/four_ingots", true, "tconstruct:molten_iron", 360, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/iron/five_ingots", true, "tconstruct:molten_iron", 450, false);	
	createBasinMelting(event, "forge:nuggets/iron", true, "tconstruct:molten_iron", 10, false);	
	
	//Gold
	createBasinMelting(event, "createdeco:gold_coin", false, "tconstruct:molten_gold", 90, false);
	createBasinMelting(event, "minecraft:golden_helmet", false, "tconstruct:molten_gold", 450, false);
	
	createBasinMelting(event, "forge:nuggets/gold", true, "tconstruct:molten_gold", 10, false);
	createBasinMelting(event, "forge:ingots/gold", true, "tconstruct:molten_gold", 90, false);
	createBasinMelting(event, "forge:storage_blocks/gold", true, "tconstruct:molten_gold", 810, false);	

	createBasinMelting(event, "vulpinian_skies_core:basin_melting/gold/half_ingot", true, "tconstruct:molten_gold", 45, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/gold/one_ingot", true, "tconstruct:molten_gold", 90, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/gold/two_ingots", true, "tconstruct:molten_gold", 180, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/gold/three_ingots", true, "tconstruct:molten_gold", 270, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/gold/four_ingots", true, "tconstruct:molten_gold", 360, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/gold/six_ingots", true, "tconstruct:molten_gold", 540, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/gold/seven_ingots", true, "tconstruct:molten_gold", 630, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/gold/eight_ingots", true, "tconstruct:molten_gold", 720, false);
	
	//Copper
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/copper/one_nugget", true, "tconstruct:molten_copper", 10, false);
	createBasinMelting(event, "forge:ingots/copper", true, "tconstruct:molten_copper", 90, false);
	createBasinMelting(event, "forge:storage_blocks/copper", true, "tconstruct:molten_copper", 810, false);
	
	createBasinMelting(event, "createdeco:copper_coin", false, "tconstruct:molten_copper", 90, false);
	createBasinMelting(event, "createdeco:copper_coinstack", false, "tconstruct:molten_copper", 720, false);
	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/copper/three_nuggets", true, "tconstruct:molten_copper", 30, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/copper/half_ingot", true, "tconstruct:molten_copper", 45, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/copper/one_ingot", true, "tconstruct:molten_copper", 90, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/copper/two_ingots", true, "tconstruct:molten_copper", 180, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/copper/three_ingots", true, "tconstruct:molten_copper", 270, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/copper/four_ingots", true, "tconstruct:molten_copper", 360, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/copper/nine_ingots", true, "tconstruct:molten_copper", 810, false);
	
	event.custom({
		  "type": "createbigcannons:melting",
		  "ingredients": [
			{
			  "item": "create:copper_diving_helmet"
			}
		  ],
		  "results": [
			{
			  "fluid": "tconstruct:molten_copper",
			  "amount": 450
			},
			{
			  "fluid": "tconstruct:molten_glass",
			  "amount": 1000
			}			
		  ],
		  "processingTime": 300,
		  "heatRequirement": "heated"		  
		}
	);
	
	event.custom({
		  "type": "createbigcannons:melting",
		  "ingredients": [
			{
			  "item": "create:copper_backtank"
			}
		  ],
		  "results": [
			{
			  "fluid": "tconstruct:molten_copper",
			  "amount": 1080
			},
			{
			  "fluid": "minecraft:lava",
			  "amount": 100
			}			
		  ],
		  "processingTime": 300,
		  "heatRequirement": "heated"		  
		}
	);
	
	//Netherite is different from debris, only for netherite items
	
	createBasinMelting(event, "forge:ingots/netherite", true, "tconstruct:molten_netherite", 90, true);
	createBasinMelting(event, "forge:storage_blocks/netherite", true, "tconstruct:molten_netherite", 810, true);	
	createBasinMelting(event, "createdeco:netherite_coin", false, "tconstruct:molten_netherite", 90, true);
	createBasinMelting(event, "createdeco:netherite_coinstack", false, "tconstruct:molten_netherite", 720, true);
	
	createBasinMelting(event, "forge:nuggets/netherite", true, "tconstruct:molten_netherite", 10, true);	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/netherite/three_nuggets", true, "tconstruct:molten_netherite", 30, true);	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/netherite/one_ingot", true, "tconstruct:molten_netherite", 90, true);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/netherite/two_ingots", true, "tconstruct:molten_netherite", 180, true);	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/netherite/four_ingots", true, "tconstruct:molten_netherite", 360, true);
	
	createBasinMeltingDouble(event, "vulpinian_skies_core:basin_melting/netherite/boots", true, "tconstruct:molten_netherite", 90, "tconstruct:molten_diamond", 400, true);
	createBasinMeltingDouble(event, "vulpinian_skies_core:basin_melting/netherite/leggings", true, "tconstruct:molten_netherite", 90, "tconstruct:molten_diamond", 700, true);
	createBasinMeltingDouble(event, "vulpinian_skies_core:basin_melting/netherite/chestplates", true, "tconstruct:molten_netherite", 90, "tconstruct:molten_diamond", 800, true);
	createBasinMeltingDouble(event, "vulpinian_skies_core:basin_melting/netherite/helmets", true, "tconstruct:molten_netherite", 90, "tconstruct:molten_diamond", 500, true);
	
	createBasinMeltingDouble(event, "vulpinian_skies_core:basin_melting/netherite/one_gem_one_ingot", true, "tconstruct:molten_netherite", 90, "tconstruct:molten_diamond", 100, true);
	createBasinMeltingDouble(event, "vulpinian_skies_core:basin_melting/netherite/two_gems_one_ingot", true, "tconstruct:molten_netherite", 90, "tconstruct:molten_diamond", 200, true);
	createBasinMeltingDouble(event, "vulpinian_skies_core:basin_melting/netherite/three_gems_one_ingot", true, "tconstruct:molten_netherite", 90, "tconstruct:molten_diamond", 300, true);
	
	//Zinc	
	event.replaceInput({}, 'createaddition:zinc_sheet', 'createdeco:zinc_sheet');
	event.replaceOutput({}, 'createaddition:zinc_sheet', 'createdeco:zinc_sheet');
	
	createBasinMelting(event, "forge:nuggets/zinc", true, "tconstruct:molten_zinc", 10, false);
	createBasinMelting(event, "forge:ingots/zinc", true, "tconstruct:molten_zinc", 90, false);
	createBasinMelting(event, "forge:storage_blocks/zinc", true, "tconstruct:molten_zinc", 810, false);
	
	createBasinMelting(event, "createdeco:zinc_coin", false, "tconstruct:molten_zinc", 90, false);
	createBasinMelting(event, "createdeco:zinc_coinstack", false, "tconstruct:molten_zinc", 720, false);	
	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/zinc/three_nuggets", true, "tconstruct:molten_zinc", 30, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/zinc/half_ingot", true, "tconstruct:molten_zinc", 45, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/zinc/one_ingot", true, "tconstruct:molten_zinc", 90, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/zinc/two_ingots", true, "tconstruct:molten_zinc", 180, false);
	
	//Brass
	createBasinMelting(event, "forge:ingots/brass", true, "tconstruct:molten_brass", 90, false);
	createBasinMelting(event, "forge:storage_blocks/brass", true, "tconstruct:molten_brass", 810, false);
	
	createBasinMelting(event, "createdeco:brass_coin", false, "tconstruct:molten_brass", 90, false);
	createBasinMelting(event, "createdeco:brass_coinstack", false, "tconstruct:molten_brass", 720, false);
	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/brass/one_nugget", true, "tconstruct:molten_brass", 10, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/brass/three_nuggets", true, "tconstruct:molten_brass", 30, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/brass/half_ingot", true, "tconstruct:molten_brass", 45, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/brass/one_ingot", true, "tconstruct:molten_brass", 90, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/brass/two_ingots", true, "tconstruct:molten_brass", 180, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/brass/four_ingots", true, "tconstruct:molten_brass", 360, false);
	
	//Silver
	createBasinMelting(event, "forge:nuggets/silver", true, "tconstruct:molten_silver", 10, false);
	createBasinMelting(event, "forge:ingots/silver", true, "tconstruct:molten_silver", 90, false);
	createBasinMelting(event, "forge:storage_blocks/silver", true, "tconstruct:molten_silver", 810, false);
	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/silver/one_ingot", true, "tconstruct:molten_silver", 90, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/silver/two_ingots", true, "tconstruct:molten_silver", 180, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/silver/three_ingots", true, "tconstruct:molten_silver", 270, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/silver/four_ingots", true, "tconstruct:molten_silver", 360, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/silver/five_ingots", true, "tconstruct:molten_silver", 450, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/silver/seven_ingots", true, "tconstruct:molten_silver", 630, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/silver/eight_ingots", true, "tconstruct:molten_silver", 720, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/silver/one_bucket", true, "tconstruct:molten_silver", 1000, false);
	
	//Electrum
	createBasinMelting(event, "forge:nuggets/electrum", true, "tconstruct:molten_electrum", 10, false);
	createBasinMelting(event, "forge:ingots/electrum", true, "tconstruct:molten_electrum", 90, false);
	
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/electrum/half_ingot", true, "tconstruct:molten_electrum", 45, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/electrum/one_ingot", true, "tconstruct:molten_electrum", 90, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/electrum/two_ingots", true, "tconstruct:molten_electrum", 180, false);
	
	//Cobalt
	createBasinMelting(event, "forge:nuggets/cobalt", true, "tconstruct:molten_cobalt", 10, false);	
	createBasinMelting(event, "forge:ingots/cobalt", true, "tconstruct:molten_cobalt", 90, false);	
	createBasinMelting(event, "forge:storage_blocks/cobalt", true, "tconstruct:molten_cobalt", 810, false);	
	
	//Slimesteel
	createBasinMelting(event, "forge:nuggets/slimesteel", true, "tconstruct:molten_slimesteel", 10, false);	
	createBasinMelting(event, "forge:ingots/slimesteel", true, "tconstruct:molten_slimesteel", 90, false);	
	createBasinMelting(event, "forge:storage_blocks/slimesteel", true, "tconstruct:molten_slimesteel", 810, false);	
	
	//Amethyst Bronze
	createBasinMelting(event, "forge:nuggets/amethyst_bronze", true, "tconstruct:molten_amethyst_bronze", 10, false);	
	createBasinMelting(event, "forge:ingots/amethyst_bronze", true, "tconstruct:molten_amethyst_bronze", 90, false);	
	createBasinMelting(event, "forge:storage_blocks/amethyst_bronze", true, "tconstruct:molten_amethyst_bronze", 810, false);	

	//Rose Gold
	createBasinMelting(event, "forge:nuggets/rose_gold", true, "tconstruct:molten_rose_gold", 10, false);	
	createBasinMelting(event, "forge:ingots/rose_gold", true, "tconstruct:molten_rose_gold", 90, false);	
	createBasinMelting(event, "forge:storage_blocks/rose_gold", true, "tconstruct:molten_rose_gold", 810, false);
	
	//Pig Iron
	createBasinMelting(event, "forge:nuggets/pig_iron", true, "tconstruct:molten_pig_iron", 10, false);	
	createBasinMelting(event, "forge:ingots/pig_iron", true, "tconstruct:molten_pig_iron", 90, false);	
	createBasinMelting(event, "forge:storage_blocks/pig_iron", true, "tconstruct:molten_pig_iron", 810, false);	
	
	//Manyullyn
	createBasinMelting(event, "forge:nuggets/manyullyn", true, "tconstruct:molten_manyullyn", 10, false);	
	createBasinMelting(event, "forge:ingots/manyullyn", true, "tconstruct:molten_manyullyn", 90, false);	
	createBasinMelting(event, "forge:storage_blocks/manyullyn", true, "tconstruct:molten_manyullyn", 810, false);	
	
	//Hepatizon
	createBasinMelting(event, "forge:nuggets/hepatizon", true, "tconstruct:molten_hepatizon", 10, false);	
	createBasinMelting(event, "forge:ingots/hepatizon", true, "tconstruct:molten_hepatizon", 90, false);	
	createBasinMelting(event, "forge:storage_blocks/hepatizon", true, "tconstruct:molten_hepatizon", 810, false);	
	
	//Queen's Slime
	createBasinMelting(event, "forge:nuggets/queens_slime", true, "tconstruct:molten_queens_slime", 10, false);	
	createBasinMelting(event, "forge:ingots/queens_slime", true, "tconstruct:molten_queens_slime", 90, false);	
	createBasinMelting(event, "forge:storage_blocks/queens_slime", true, "tconstruct:molten_queens_slime", 810, false);	
	
	//Quartz Additional
	createBasinMelting(event, "byg:quartzite_sand", false, "tconstruct:molten_quartz", 100, false);
	
	//Fluid Compacting
	
	event.recipes.create.compacting('minecraft:iron_ingot', Fluid.of('tconstruct:molten_iron', 90));
	event.recipes.create.compacting('minecraft:iron_block', Fluid.of('tconstruct:molten_iron', 810));
	
	event.recipes.create.compacting('minecraft:copper_ingot', Fluid.of('tconstruct:molten_copper', 90));
	event.recipes.create.compacting('minecraft:copper_block', Fluid.of('tconstruct:molten_copper', 810));
	
	event.recipes.create.compacting('minecraft:gold_ingot', Fluid.of('tconstruct:molten_gold', 90));
	event.recipes.create.compacting('minecraft:gold_block', Fluid.of('tconstruct:molten_gold', 810));
	
	event.recipes.create.compacting('minecraft:diamond', {fluid: "tconstruct:molten_diamond", amount: 100});
	event.recipes.create.compacting('minecraft:diamond_block', {fluid: "tconstruct:molten_diamond", amount: 900});
	
	event.recipes.create.compacting('create:experience_block', {fluid: "create_enchantment_industry:experience", amount: 27});
	event.recipes.create.compacting('create:experience_nugget', {fluid: "create_enchantment_industry:experience", amount: 3});
	
	event.recipes.create.compacting('minecraft:netherite_ingot', Fluid.of('tconstruct:molten_netherite', 90));
	event.recipes.create.compacting('minecraft:netherite_block', Fluid.of('tconstruct:molten_netherite', 810));
	
	event.recipes.create.compacting('bygonenether:netherite_scrap_ingot', Fluid.of('tconstruct:molten_debris', 90));
	event.remove({id:'bygonenether:mixing/netherite_scrap_ingot'});
	event.recipes.create.mixing('bygonenether:netherite_scrap_ingot', '9x #forge:nuggets/netherite_scrap').heated();
	
	event.remove({id:'createaddition:pressing/zinc_ingot'});
	event.recipes.create.compacting('create:zinc_ingot', Fluid.of('tconstruct:molten_zinc', 90));
	event.recipes.create.compacting('create:zinc_block', Fluid.of('tconstruct:molten_zinc', 810));	
	
	event.remove({id:'createaddition:mixing/electrum'});
	event.recipes.create.mixing('createaddition:electrum_ingot', ['3x iceandfire:silver_nugget', '6x minecraft:gold_nugget']).heated();
	event.recipes.create.mixing('createaddition:electrum_ingot', [Fluid.of('tconstruct:molten_silver', 30), Fluid.of('tconstruct:molten_gold', 60)]);
	
	
	event.recipes.create.compacting('create:brass_ingot', Fluid.of('tconstruct:molten_brass', 90));
	event.recipes.create.compacting('create:brass_block', Fluid.of('tconstruct:molten_brass', 810));
	event.recipes.create.mixing('create:brass_ingot', [Fluid.of('tconstruct:molten_copper', 45), Fluid.of('tconstruct:molten_zinc', 45)]);
	event.recipes.create.mixing('create:brass_block', [Fluid.of('tconstruct:molten_copper', 405), Fluid.of('tconstruct:molten_zinc', 405)]);
	
	event.recipes.create.compacting('iceandfire:silver_ingot', Fluid.of('tconstruct:molten_silver', 90));
	event.recipes.create.compacting('iceandfire:silver_block', Fluid.of('tconstruct:molten_silver', 810));
	
	event.recipes.create.compacting('tconstruct:cobalt_ingot', Fluid.of('tconstruct:molten_cobalt', 90));
	event.recipes.create.compacting('tconstruct:cobalt_block', Fluid.of('tconstruct:molten_cobalt', 810));
	
	//event.recipes.create.compacting('createdeco:cast_iron_ingot', Fluid.of('createbigcannons:molten_cast_iron', 90));
	
	//Create Crushing for Rest of Modpack Ores
	function genGemsOreCrushing(event) {				
		
		const gems = ['pale_diamond', 'emerald', 'ruby', 'sapphire', 'amethyst', 'opal', 'garnet', 'topaz', 'peridot', 'aquamarine', 'zircon', 'alexandrite', 'tanzanite', 'tourmaline', 'spinel', 'black_opal', 'citrine', 'morganite', 'ametrine', 'kunzite', 'iolite']; //For some array gen
		
		gems.forEach((gem) => {
			//Utils.server.tell("Got here " + gem);
		
			event.recipes.createCrushing([
				`gemsnjewels:${gem}`,
				Item.of(`gemsnjewels:${gem}`).withChance(0.75),			
				Item.of(`create:experience_nugget`).withChance(0.75),
				Item.of(`minecraft:cobblestone`).withChance(0.12)		
			], `gemsnjewels:${gem}_ore_block`);
			
			event.recipes.createCrushing([
				`2x gemsnjewels:${gem}`,
				Item.of(`gemsnjewels:${gem}`).withChance(0.25),
				Item.of(`create:experience_nugget`).withChance(0.75),			
				Item.of(`minecraft:cobbled_deepslate`).withChance(0.12)		
			], `gemsnjewels:${gem}_deepslate_ore_block`);
			
			event.recipes.createCrushing([
				`2x gemsnjewels:${gem}`,
				Item.of(`gemsnjewels:${gem}`).withChance(0.35),
				Item.of(`create:experience_nugget`).withChance(0.75),			
				Item.of(`minecraft:netherrack`).withChance(0.12)		
			], `gemsnjewels:${gem}_nether_ore_block`);
		});
		
		event.recipes.createCrushing([
				`2x minecraft:emerald`,
				Item.of(`minecraft:emerald`).withChance(0.35),
				Item.of(`create:experience_nugget`).withChance(0.75),			
				Item.of(`minecraft:netherrack`).withChance(0.12)		
			], `gemsnjewels:v_emerald_nether_ore_block`);
			
			event.recipes.createCrushing([
				`2x minecraft:diamond`,
				Item.of(`minecraft:diamond`).withChance(0.35),
				Item.of(`create:experience_nugget`).withChance(0.75),			
				Item.of(`minecraft:netherrack`).withChance(0.12)		
			], `gemsnjewels:diamond_nether_ore_block`);
			
	}
	genGemsOreCrushing(event);
	
	function genUnderOreCrushing(event) {
		const enhancedVanilla = ['coal', 'iron_ingot', 'gold_ingot', 'diamond'];
		
		enhancedVanilla.forEach((element) => {
			
			let resource = (element.includes('ingot') ? ('create:crushed_raw_' + element.substring(0, element.indexOf('_'))) : ('minecraft:' + element));
			
			let resourceOre = (element.includes('ingot') ? element.substring(0, element.indexOf('_')) : element);
			
			event.recipes.createCrushing([
				`2x ${resource}`,
				Item.of(`${resource}`).withChance(0.35),
				Item.of(`create:experience_nugget`).withChance(0.75),			
				Item.of(`undergarden:depthrock`).withChance(0.12)		
			], `undergarden:depthrock_${resourceOre}_ore`);
			
			if (resourceOre == 'gold') {
				return;
			}
			
			event.recipes.createCrushing([
				`2x ${resource}`,
				Item.of(`${resource}`).withChance(0.35),
				Item.of(`create:experience_nugget`).withChance(0.75),			
				Item.of(`undergarden:shiverstone`).withChance(0.12)		
			], `undergarden:shiverstone_${resourceOre}_ore`);
		});
		
		event.recipes.createCrushing([
				`9x undergarden:cloggrum_nugget`,
				Item.of(`6x undergarden:cloggrum_nugget`).withChance(0.75),			
				Item.of(`2x create:experience_nugget`).withChance(0.75),
				Item.of(`undergarden:depthrock`).withChance(0.12)		
		], `undergarden:depthrock_cloggrum_ore`);
		
		event.recipes.createCrushing([
				`9x undergarden:cloggrum_nugget`,
				Item.of(`6x undergarden:cloggrum_nugget`).withChance(0.75),			
				Item.of(`2x create:experience_nugget`).withChance(0.75),
				Item.of(`undergarden:shiverstone`).withChance(0.12)
		], `undergarden:shiverstone_cloggrum_ore`);
		
		event.recipes.createCrushing([
				`9x undergarden:froststeel_nugget`,
				Item.of(`6x undergarden:froststeel_nugget`).withChance(0.75),			
				Item.of(`2x create:experience_nugget`).withChance(0.75),
				Item.of(`undergarden:shiverstone`).withChance(0.12)
		], `undergarden:shiverstone_froststeel_ore`);
		
		const utheriumOres = ['depthrock', 'shiverstone', 'tremblecrust'];
		
		utheriumOres.forEach((ore) => {
			
			event.recipes.createCrushing([
				`undergarden:utherium_crystal`,
				Item.of(`undergarden:utherium_crystal`).withChance(0.50),			
				Item.of(`3x undergarden:utheric_shard`).withChance(0.60),			
				Item.of(`3x create:experience_nugget`).withChance(0.75),
				Item.of(`undergarden:${ore}`).withChance(0.12)
		], `undergarden:${ore}_utherium_ore`);
			
		});
		
		const regaliumOres = ['depthrock', 'shiverstone'];
		
		regaliumOres.forEach((ore) => {
			
			event.recipes.createCrushing([
				`undergarden:regalium_crystal`,
				Item.of(`undergarden:regalium_crystal`).withChance(0.75),				
				Item.of(`4x create:experience_nugget`).withChance(0.75),
				Item.of(`undergarden:${ore}`).withChance(0.12)
			], `undergarden:${ore}_regalium_ore`);
			
		});
		
		event.recipes.createCrushing([
				`9x undergarden:cloggrum_nugget`,
				Item.of(`6x undergarden:cloggrum_nugget`).withChance(0.75),				
				Item.of(`2x create:experience_nugget`).withChance(0.75)				
		], `undergarden:raw_cloggrum`);
		
		event.recipes.createCrushing([
				`81x undergarden:cloggrum_nugget`,
				Item.of(`54x undergarden:cloggrum_nugget`).withChance(0.75),				
				Item.of(`18x create:experience_nugget`).withChance(0.75)				
		], `undergarden:raw_cloggrum_block`);
		
		
	}
	genUnderOreCrushing(event);
	
	function genIceandfireCrushing(event) {
		
		const icefireGems = ['amythest', 'sapphire']; //It's iceandfire's misspelling not mine
		
		icefireGems.forEach((gem) => {
			event.recipes.createCrushing([
				`iceandfire:${gem}_gem`,
				Item.of(`iceandfire:${gem}_gem`).withChance(0.50),							
				Item.of(`3x create:experience_nugget`).withChance(0.75),
				Item.of(`minecraft:cobblestone`).withChance(0.12)
			], `iceandfire:${gem}_ore`);
			
		})
		
		event.recipes.createCrushing([
				`5x create:crushed_raw_copper`,
				Item.of(`create:crushed_raw_copper`).withChance(0.50),
				Item.of(`create:experience_nugget`).withChance(0.75),
				Item.of(`minecraft:cobblestone`).withChance(0.12)
		], `iceandfire:copper_ore`);
		
		event.recipes.createCrushing([
				`9x iceandfire:silver_nugget`,
				Item.of(`6x iceandfire:silver_nugget`).withChance(0.75),			
				Item.of(`2x create:experience_nugget`).withChance(0.75),
				Item.of(`minecraft:cobblestone`).withChance(0.12)
		], `iceandfire:silver_ore`);		
		
	}
	genIceandfireCrushing(event);
	
	event.remove({id:'createaddition:crushing/diamond'})
	event.recipes.createCrushing([
		'2x createaddition:diamond_grit',
		Item.of('create:experience_nugget').withChance(0.5)			
	], '#forge:gems/diamond');

	
	//Weather2 blocks
	event.remove ({id:'weather2:weather_item'});
	event.remove ({id:'weather2:weather_deflector'});
	event.custom (
	{
	  "type": "ars_nouveau:imbuement",
	  "input": {
		"item": "quark:bottled_cloud"
	  },
	  "output": "weather2:weather_item",
	  "count": 1,
	  "source": 2000,
	  "pedestalItems": [
		{
		  "item": {
			"item": "ars_nouveau:abjuration_essence"
		  }
		},
		{
		  "item": {
			"item": "ars_nouveau:water_essence"
		  }
		},
		{
		  "item": {
			"item": "ars_nouveau:air_essence"
		  }
		}
	  ]
	});
	event.shaped('weather2:weather_deflector', [
		'BBB',
		'LTL',
		'BBB'
		], {
		B: 'create:brass_ingot',
		L: 'createdeco:blue_brass_lamp',
		T: 'weather2:weather_item'
		
	});

	createBasinMelting(event, "vulpinian_skies_core:basin_melting/water/one_eight_bucket", true, "minecraft:water", 125, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/water/half_bucket", true, "minecraft:water", 500, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/water/one_bucket", true, "minecraft:water", 1000, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/water/nine_buckets", true, "minecraft:water", 9000, false);
	createBasinMelting(event, "vulpinian_skies_core:basin_melting/water/eighty_one_buckets", true, "minecraft:water", 81000, false);
	
	//Basin Fermenting
	//processingTime = ticks to produce fermented result
	
	event.remove({id:'createdieselgenerators:compacting/plant_oil'});
	event.remove({id:'createdieselgenerators:basin_fermenting/fermentable'});
	event.remove({id:'createdieselgenerators:compat/farmers_delight/basin_fermenting/fermentable'});
	event.remove({id:'createdieselgenerators:mixing/biodiesel'});
	
	event.remove({id:'createaddition:mixing/bioethanol'});
	
	event.remove({input:'createdieselgenerators:plant_oil_bucket'});
	event.remove({output:'createdieselgenerators:plant_oil_bucket'});
	
	event.remove({input:'createdieselgenerators:biodiesel_bucket'});
	event.remove({output:'createdieselgenerators:biodiesel_bucket'});
	
	event.remove({input:'createdieselgenerators:ethanol_bucket'});
	event.remove({output:'createdieselgenerators:ethanol_bucket'});
	
	event.custom(
		{
		  "type": "createdieselgenerators:basin_fermenting",
		  "ingredients": [
			{
			  "item": "undergarden:rotten_blisterberry"
			},
			{
			  "fluid": "minecraft:water",
			  "amount": 50
			}
		  ],
		  "processingTime": 400,
		  "results": [
			{
			  "fluid": "undergarden:virulent_mix_source",
			  "amount": 50
			}
		  ]
		}
	).id('vulpinian_skies_core:basin_fermenting/virulent_mix/rotten_blisterberry');
	
	event.custom(
		{
		  "type": "createdieselgenerators:basin_fermenting",
		  "ingredients": [
			{
			  "item": "undergarden:blood_mushroom_globule"
			},
			{
			  "fluid": "minecraft:water",
			  "amount": 50
			}
		  ],
		  "processingTime": 1600,
		  "results": [
			{
			  "fluid": "undergarden:virulent_mix_source",
			  "amount": 200
			}
		  ]
		}
	).id('vulpinian_skies_core:basin_fermenting/virulent_mix/blood_mushroom_globule');
	
	event.custom(
		{
		  "type": "createdieselgenerators:basin_fermenting",
		  "ingredients": [
			{
			  "tag": "undergarden:mushrooms"
			},
			{
			  "fluid": "minecraft:water",
			  "amount": 50
			}
		  ],
		  "processingTime": 600,
		  "results": [
			{
			  "fluid": "undergarden:virulent_mix_source",
			  "amount": 75
			}
		  ]
		}
	).id('vulpinian_skies_core:basin_fermenting/virulent_mix/mushrooms');
	
	event.custom(
		{
		  "type": "createdieselgenerators:basin_fermenting",
		  "ingredients": [
			{
			  "tag": "vulpinian_skies_core:basin_fermenting/virulent_mix/under_mushroom_blocks"
			}
		  ],
		  "processingTime": 400,
		  "results": [
			{
			  "fluid": "undergarden:virulent_mix_source",
			  "amount": 50
			}
		  ]
		}
	).id('vulpinian_skies_core:basin_fermenting/virulent_mix/mushroom_blocks');
	
	event.custom(
		{
		  "type": "createdieselgenerators:basin_fermenting",
		  "ingredients": [
			{
			  "item": "undergarden:ink_mushroom_cap"
			}
		  ],
		  "processingTime": 1000,
		  "results": [
			{
			  "fluid": "create_enchantment_industry:ink",
			  "amount": 125
			}
		  ]
		}
	).id('vulpinian_skies_core:basin_fermenting/ink/ink_mushroom_cap');
	

	event.custom(
		{
		  "type": "createdieselgenerators:basin_fermenting",
		  "ingredients": [
			{
			  "tag": "forge:sugar"
			},
			{
			  "item": "create:cinder_flour"
			},			
			{
			  "item": "createaddition:biomass"			  
			},
			{
			  "item": "createaddition:biomass"			  
			}
		  ],
		  "processingTime": 1000,
		  "results": [
			{
			  "fluid": "createaddition:bioethanol",
			  "amount": 125
			}
		  ]
		}
	).id('vulpinian_skies_core:basin_fermenting/bioethanol');
	
	event.recipes.create.mixing(Fluid.of('vulpinian_skies_core:necroethanol', 100), [
		Fluid.of('createaddition:bioethanol', 50),
		Fluid.of('undergarden:virulent_mix_source', 25),
		'undergarden:goo_ball'
	]);
	
	event.recipes.create.mixing(Fluid.of('vulpinian_skies_core:necroethanol', 900), [
		Fluid.of('createaddition:bioethanol', 450),
		Fluid.of('undergarden:virulent_mix_source', 225),
		'undergarden:goo_block'
	]);
	
	event.remove({id:'create:fill_minecraft_bucket_with_createdieselgenerators_plant_oil'});
	
	event.remove({input:Fluid.of('createdieselgenerators:plant_oil')});
	event.remove({output:Fluid.of('createdieselgenerators:plant_oil')});
	//Liquid burning = Create Additions recipe for allowing blaze burners to use fluid fuels
	event.custom(
		{
			"type":"createaddition:liquid_burning",
			"input": {
				  "fluid": "vulpinian_skies_core:necroethanol",
				  "amount": 1000
			},
			"burnTime": 51200,
			"superheated": true,			
		}
	);																					 
	
	//Food Recipes
	event.recipes.create.crushing([
		'2x vulpinian_skies_core:grongle_sugar',
		Item.of(`create:experience_nugget`).withChance(0.15)
		], 'undergarden:gronglet').id('vulpinian_skies_core:grongle_sugar_crushing');
		
	event.recipes.create.milling([
		'2x vulpinian_skies_core:grongle_sugar',
		Item.of(`create:experience_nugget`).withChance(0.15)
		], 'undergarden:gronglet').id('vulpinian_skies_core:grongle_sugar_milling');
	
	event.remove({id:'undergarden:gloomgourd_pie'});
	event.shaped('vulpinian_skies_core:gloomgourd_pie', [
		'MMM',
		'DGD',
		'SCS'
		], {
		C: 'farmersdelight:pie_crust',
		D: 'undergarden:droopvine_item',
		G: 'undergarden:gloomgourd',
		S: 'vulpinian_skies_core:grongle_sugar',
		M: 'undergarden:glitterkelp'
	}).id('vulpinian_skies_core:gloomgourd_pie');
	
	event.shaped('vulpinian_skies_core:gloomgourd_pie', [
		'SS ',
		'SS ',
		'   '
		], {
		S: 'vulpinian_skies_core:gloomgourd_pie_slice'
	}).id('vulpinian_skies_core:gloomgourd_pie_from_slices');
	
	event.custom(
		{
		  "type": "farmersdelight:cutting",
		  "ingredients": [
			{
			  "item": "vulpinian_skies_core:gloomgourd_pie"
			}
		  ],
		  "tool": {
			"tag": "forge:tools/knives"
		  },
		  "result": [
			{
			  "item": "vulpinian_skies_core:gloomgourd_pie_slice",
			  "count": 4
			}
		  ]
		}
	);
})

onEvent('recipes.after_load', event => {
	//Nonworking?
	event.remove({input:'createdieselgenerators:plant_oil_bucket'});
	event.remove({output:'createdieselgenerators:plant_oil_bucket'});
	
	event.remove({input:Fluid.of('createdieselgenerators:plant_oil')});
	event.remove({output:Fluid.of('createdieselgenerators:plant_oil')});
	
	event.remove({input:'createdieselgenerators:biodiesel_bucket'});
	event.remove({output:'createdieselgenerators:biodiesel_bucket'});
	
	event.remove({input:'createdieselgenerators:ethanol_bucket'});
	event.remove({output:'createdieselgenerators:ethanol_bucket'});
})

onEvent('item.tags', event => {
	// Get the #forge:cobblestone tag collection and add Diamond Ore to it
	// event.get('forge:cobblestone').add('minecraft:diamond_ore'
	// Get the #forge:cobblestone tag collection and remove Mossy Cobblestone from it
	// event.get('forge:cobblestone').remove('minecraft:mossy_cobblestone')
	
	
	event.add('forge:cogwheels', 'create:cogwheel');
	event.add('forge:large_cogwheels', 'create:large_cogwheel');
	event.add('forge:ender_pearls', 'bygonenether:warped_ender_pearl');
	event.add('forge:nuggets/netherite_scrap', 'bygonenether:netherite_scrap_nugget');
	
	
	
	//Allows stripped logs from Regions Unexplored and Twigs mods to be used with Create
	event.add('forge:stripped_logs', /regions_unexplored:stripped.+(_log|_wood)/)
	event.add('minecraft:flowers', 'iceandfire:fire_lily');
	event.add('minecraft:small_flowers', 'iceandfire:fire_lily');
	
	event.add('minecraft:flowers', 'iceandfire:frost_lily');
	event.add('minecraft:small_flowers', 'iceandfire:frost_lily');

	event.add('minecraft:flowers', 'iceandfire:lightning_lily');
	event.add('minecraft:small_flowers', 'iceandfire:lightning_lily');

	
	event.add('forge:gems/quartz', 'byg:quartz_crystal');
	
	//event.remove('forge:ingots/cast_iron', 'createbigcannons:cast_iron_ingot')
	
	event.remove('createbigcannons:ingot_cast_iron', 'createbigcannons:cast_iron_ingot');
	
	event.remove('forge:rods/all_metal', 'buildersaddition:iron_rod');
	event.remove('forge:rods/iron', 'buildersaddition:iron_rod');
	event.remove('forge:plates', 'createaddition:zinc_sheet');
	event.remove('forge:plates/plates', 'createaddition:zinc_sheet');
	event.remove('forge:plates/all_metal', 'createaddition:zinc_sheet');
	event.remove('forge:plates/zinc', 'createaddition:zinc_sheet');
	
	event.add('forge:plates', 'createdeco:zinc_sheet');
	event.add('forge:all_metal', 'createdeco:zinc_sheet');
	
	event.add('forge:nuggets/brass', 'collectibles:brass_coin');
	
	event.add('forge:nuggets/silver', 'collectibles:silver_coin');
	
	
	/*for (let i = 0; i < classGGuns.length; i++) {
		event.add(`'vulpinian_skies:weapons/classG', '${classGGuns[i]}'`);		
	};*/
	
	event.add('forge:ores/diamond', 'gemsnjewels:pale_diamond_ore_block');
	event.add('forge:ores/diamond', 'gemsnjewels:pale_diamond_deepslate_ore_block');
	event.add('forge:ores/diamond', 'gemsnjewels:pale_diamond_nether_ore_block');
	
	event.add('forge:nuggets/diamond', 'born_in_chaos_v1:diamond_termite_shard');
	event.add('forge:nuggets/diamond', 'collectibles:diamond_fragment');
	
	event.add('forge:nuggets/emerald', 'collectibles:emerald_fragment');
	
	event.add('minecraft:bookshelf_books', 'patchouli:guide_book');


	event.add('forge:seeds', 'undergarden:blisterberry');
	event.add('forge:seeds', 'undergarden:underbeans');
	event.add('forge:seeds', 'undergarden:droopvine_item');
	
	event.add('create:upright_on_belt', 'vulpinian_skies_core:gloomgourd_pie');
	
})

onEvent('tags.blocks', event => {
	
	//Tagloading fixes, were meant to be done in a trio of creating a spoofed item via startup_script, hiding via JEi in client_script, and removing it from tag here
	//But the LMFT mod came to the rescue to automate it all. However, this approach can be done if shtf
	//event.remove('quark:wraith_spawnable', 'quark:soul_stone');
	//event.remove('create:wrench_pickup', 'create_things_and_misc:copper_scaffolding');
	
	event.add('minecraft:mineable/pickaxe', 'weather2:weather_deflector');
	
})

onEvent('tags.fluids', event => {
	
	//Diesel Engine fuel tags defaults:
	//'createdieselgenerators:diesel_engine_fuel_<slow/fast>_<weak/strong>'
	//Slow = 48 RPM
	//Fast = 94 RPM
	//Weak = 512 SU
	//Strong = 1024 SU
	//eg 'createdieselgenerators:diesel_engine_fuel_slow_weak' = 48 RPM, 512 SU
	
	// Obsolete since now Diesel engien fuel data is JSON-based.
	// event.add('createdieselgenerators:diesel_engine_fuel_slow_weak', 'createaddition:seed_oil');
	// event.add('createdieselgenerators:diesel_engine_fuel_fast_weak', 'createaddition:bioethanol');
	// event.add('createdieselgenerators:diesel_engine_fuel_slow_strong', 'vulpinian_skies_core:necroethanol');
	// event.remove('forge:ethanol', 'createdieselgenerators:ethanol');
	// event.remove('forge:fuel', 'createdieselgenerators:biodiesel');
	// event.remove('forge:biodiesel', 'createdieselgenerators:biodiesel');
	// event.remove('forge:plantoil', 'createdieselgenerators:plant_oil');
	
	// Diesel Engine fuel registration occurs at startup and needs the fluids to be tagged properly.
	event.add('forge:plantoil', 'createaddition:seed_oil');
	event.add('forge:ethanol', 'createaddition:bioethanol');
	event.add('forge:diesel', 'vulpinian_skies_core:necroethanol');
	
	
	event.add('minecraft:water', 'vulpinian_skies_core:necroethanol');
	event.add('minecraft:water', 'vulpinian_skies_core:flowing_necroethanol');
	event.add('undergarden:virulent', 'vulpinian_skies_core:necroethanol');
	event.add('undergarden:virulent', 'vulpinian_skies_core:flowing_necroethanol');
	
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
	
	
	
	
	Utils.server.tell("Fox Clicked")
	
	let idArray = [];
	
	//Utils.server.tell("" + Object.keys(event.player.inventory));
	//Utils.server.tell(event.player.inventory.get(0));
	
	for (let i = 0; i < 8; i++) {
		idArray.push(event.player.inventory.get(i));
	}
	
	console.info(idArray);
	
	
	
	
	
})



onEvent('entity.death', event => {
	
	//turns villagers who die on top of Virulent Mix into rotspawn
	if (event.entity.type == "minecraft:villager") {		
		
		let deathBlock = event.entity.getBlock().id;
		if (deathBlock == "undergarden:virulent_mix") {
			let villX = event.entity.x;
			let villY = event.entity.y;
			let villZ = event.entity.z;
			
			if (event.entity.getFullNBT().Age < 0) {
				//turns kidllagers into rotlings and adults into rotwalkers
				Utils.server.runCommandSilent(`summon undergarden:rotling ${villX} ${villY} ${villZ}`)
				Utils.server.runCommandSilent(`playsound entity.husk.converted_to_zombie master @a ${villX} ${villY} ${villZ} 1 1.5 0`);
			} else {								
				Utils.server.runCommandSilent(`summon undergarden:rotwalker ${villX} ${villY} ${villZ}`);
				Utils.server.runCommandSilent(`playsound entity.husk.converted_to_zombie master @a ${villX} ${villY} ${villZ} 1 0.8 0`);
			}
		}
	}
})



//Was meant to prevent seared spirits form persisting forever, but even with this they still persist
/*
onEvent('entity.spawned', event => {
	if (event.entity.type == 'born_in_chaos_v1:seared_spirit'){	
		event.entity.mergeFullNBT({
			PersistenceRequired:false
		});
	};	
})
*/
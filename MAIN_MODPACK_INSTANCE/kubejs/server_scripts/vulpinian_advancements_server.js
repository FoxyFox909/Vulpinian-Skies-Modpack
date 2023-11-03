// priority: 0

function prettifyId(slicedId) {
	//let itemId = "minecraft:of_iron_the_pickaxe";
	//Outputs Of Iron the Pickaxe

	//let slicedId = itemId.substring(itemId.indexOf(':') + 1);

	let splitId = slicedId.split('_');

	let prettyId = "";

	for (let i = 0, len = splitId.length; i < len; i++) {

		if (!(i === 0) && (splitId[i] === "of" || splitId[i] === "the")) {
			//console.log("x=" + prettyId);
			prettyId += " " + splitId[i];
		} else {
			
			prettyId +=  " " + splitId[i][0].toUpperCase() + splitId[i].substring(1);
			// console.log("y=" + prettyId);
		}
	
	}
	

	//console.log(slicedId);
	//console.log(splitId);
	//console.log(prettyId);

	return prettyId;
}

function genFrameAdvancement(event) {
	
	let frameLetters = ['f', 'e', 'd', 'c', 'b', 'a', 's'];
	let titles = ['Crude Copper', 'Rudimentary Ballistics', 'Getting Somewhere', 'Turn up the Heat', 'Elite Ballistics', 'Just a Nugget', 'Transcendent Ballistics'];
	
	let path, letter, previousLetter, parent, frame, description, experience;

	
	for (let i = 0, len = frameLetters.length; i < len; i++) {


		letter = frameLetters[i];
		path = `vulpinian_skies_core:advancements/ballistics/class_${letter}_frame`;
		previousLetter = frameLetters[i - 1];
		parent = (i == 0) ? "vulpinian_skies_core:ballistics/root" : `vulpinian_skies_core:ballistics/class_${previousLetter}_frame`;
		//console.info("Using path " + path + " Attempting to add:");		
		frame = `vulpinian_skies_core:class_${letter}_frame`;
		description = `Obtain a Class ${letter.toUpperCase()} Frame`;
		experience = 100 + Math.pow(10, i);

		let advancementJson = `{
				"parent": "${parent}",
				"display": {
					"icon": {
					"item": "${frame}"
					},
					"title": "${titles[i]}",
					"description": "${description}",
					"frame": "task",
					"show_toast": false,
					"announce_to_chat": true,
					"hidden": false
				},
				"criteria": {
					"requirement": {
						"trigger": "minecraft:inventory_changed",
						"conditions": {				
							"items": [
								{
									"items": [
										"${frame}"
									]
								}
							]
						}
					}
				},
				"rewards": {
					"experience": ${experience}
				}
			}`;

		let parsed = JSON.parse(advancementJson);

		
		//console.info(parsed);

		event.addJson(path, parsed);
		
		//console.info("Added " + parsed);

	}
}


function genObtainSimple(event, title, itemId, parent, xpReward) {

	let slicedId = itemId.substring(itemId.indexOf(':') + 1);
	let parentPath = parent.substring(0, parent.lastIndexOf('/'));
	let path = `vulpinian_skies_core:advancements/${parentPath}/${slicedId}`;	
	//let path = `vulpinian_skies_core:advancements/${namespace}`;	
	let prettyId = prettifyId(slicedId);
	let description = `Obtain a${prettyId}`;

	//genObtainSimple(event, "Bang Bang!", "minecraft:grass_block", "ballistics/root", "ballistics/grenade", 30);


	//Utils.server.tell("Using path: " + path + " attempting to add:");

	let advancementJson = `{
		"parent": "vulpinian_skies_core:${parent}",
		"display": {
			"icon": {
			"item": "${itemId}"
			},
			"title": "${title}",
			"description": "${description}",
			"frame": "task",
			"show_toast": false,
			"announce_to_chat": true,
			"hidden": false
		},
		"criteria": {
			"requirement": {
				"trigger": "minecraft:inventory_changed",
				"conditions": {				
					"items": [
						{
							"items": [
								"${itemId}"
							]
						}
					]
				}
			}
		}
	}`;

	let parsed = JSON.parse(advancementJson);

	if (xpReward > 0) {
		parsed.rewards = JSON.parse(`{"experience": ${xpReward}}`);
	}

	//Utils.server.tell(parsed);
	
	event.addJson(path, parsed);
	
	//Utils.server.tell("Added?");

}

onEvent('server.datapack.first', event => {
	
	// vulpinian root
	event.addJson('vulpinian_skies_core:advancements/root',
		{
		  "display": {
			"icon": {
			  "item": "vulpinian_skies_core:vulpinian_logo_small_animated"
			},
			"title": "Welcome to Vulpinia",
			"description": "A world of Engineering, Exploration, Magic, Foxes, and more...",
			"background": "weather2:textures/blocks/weather_deflector_plate.png",
			"frame": "task",
			"show_toast": false,
			"announce_to_chat": true,
			"hidden": false
		  },
		   "criteria": {
			"0": {
			  "trigger": "minecraft:inventory_changed",
			  "conditions": {}
			}
		  },
		  "requirements": [
			[
			  "0"
			]
		  ]
		}
	);
	
	event.addJson('vulpinian_skies_core:advancements/ballistics/root',
		{
		  "parent": "vulpinian_skies_core:root",
		  "display": {
			"icon": {
			  "item": "cgm:basic_bullet"
			},
			"title": "The First of Many",
			"description": "Obtain a Bullet of any kind.",
			"frame": "task",
			"show_toast": false,
			"announce_to_chat": true,
			"hidden": false
		  },
		  "criteria": {
			"requirement": {
			  "trigger": "minecraft:inventory_changed",
			  "conditions": {				
				"items": [
				  {
					"tag": "vulpinian_skies_core:ammo_all"					
				  }
				]
			  }
			}
		  },
		  "rewards": {
			"experience": 100
		  }
		}
	);

	genFrameAdvancement(event);

	//genObtainSimple(event, "Test", "minecraft:grass_block", "ballistics/root", "ballistics/testadvancement", 30);
	
	genObtainSimple(event, "Bang Bang!", "cgm:grenade", "ballistics/class_d_frame", 500);
	genObtainSimple(event, "I Can't Hear You", "cgm:stun_grenade", "ballistics/grenade", 250);

	genObtainSimple(event, "Ethereal Boom Booms", "vulpinian_skies_core:ethereal_grenade", "ballistics/class_s_frame", 20000);
	
	genObtainSimple(event, "Sweet, Terrible Person", "vulpinian_skies_core:grongle_sugar", "vulpinian_skies_core:root", 200);
	
	/*
	event.addJson('vulpinian_skies_core:advancements/ballistics/class_f_frame',
		{
		  "parent": "vulpinian_skies_core:ballistics/root",
		  "display": {
			"icon": {
			  "item": "vulpinian_skies_core:class_f_frame"
			},
			"title": "Crude Copper",
			"description": "Obtain a Class F Frame.",
			"frame": "task",
			"show_toast": false,
			"announce_to_chat": true,
			"hidden": false
		  },
		  "criteria": {
			"requirement": {
			  "trigger": "minecraft:inventory_changed",
			  "conditions": {				
				"items": [
				  {
					"items": [
						"vulpinian_skies_core:class_f_frame"
					]
				  }
				]
			  }
			}
		  },
		  "rewards": {
			"experience": 200
		  }
		}
	); */

});
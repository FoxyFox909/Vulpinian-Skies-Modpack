// priority: 0

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

onEvent('server.datapack.first', event => {
	
	event.addJson('vulpinian_skies_core:advancements/root',
		{
		  "display": {
			"icon": {
			  "item": "weather2:weather_item"
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
// priority: 0
//i2 skips gun that was fired

let gunArray = [];
gunArray = gunArray.concat(classSGuns, classAGuns, classBGuns, classCGuns, classDGuns, classEGuns, classFGuns, classGGuns);

function globalGunCooldown(event, id) {

	let i2 = gunArray.indexOf(id);
	for (var i=0, len=gunArray.length; i<len; i++) {
		if (i==i2) {
			continue;
		}
		event.player.addItemCooldown(Item.of(gunArray[i]), 10);
	}
}

onEvent('player.inventory.changed', event => {		
	if (event.item.hasTag('vulpinian_skies_core:ammo_users_all')) {
		globalGunCooldown(event, event.item.id);		
	}
})
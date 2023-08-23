onEvent('item.food_eaten', event => {

    let preUniqueFoods = event.player.fullNBT['ForgeCaps']['solcarrot:food']['foodList'].length;
    
    event.server.scheduleInTicks(2, callback => {
        let uniqueFoods = event.player.fullNBT['ForgeCaps']['solcarrot:food']['foodList'].length;
		let foodInterval = (uniqueFoods < 10) ? 5 : 10;
		
        if (uniqueFoods > preUniqueFoods) {
            let nextFood = foodInterval - (uniqueFoods % foodInterval);
            if (nextFood == foodInterval) {
                let newHealth = getPlayerMaxHP(event);
                event.player.tell(Text.of(`The flavors of this world make you stronger! Your new Max Health is:`).darkAqua().append(Text.of(` ${newHealth} (${newHealth / 2} Hearts)`).darkRed()));                
            } else {
                let isSingular = nextFood == 1;
                event.player.tell(Text.of(`New food tasted! You need ${nextFood} more unique food${isSingular ? "" : "s"} to increase your max health.`).darkAqua());
            }
        }        
    });
})

function getPlayerMaxHP(event) {

    let maxHealth = 0;
	for (let i = 0, len = event.player.fullNBT['Attributes'].length; i < len; i++) {
        if (event.player.fullNBT['Attributes'][i]['Name'].includes('minecraft:generic.max_health')) {

            let solcarrotHealth = 0;

            for (let j = 0, len2 = event.player.fullNBT['Attributes'][i]['Modifiers'].length; j < len2; j++) {
                
                if (event.player.fullNBT['Attributes'][i]['Modifiers'][j]['Name'].includes('Health Gained from Trying New Foods')) {
                    solcarrotHealth = event.player.fullNBT['Attributes'][i]['Modifiers'][j]['Amount'];
                    break;
                }
            }
            maxHealth = event.player.fullNBT['Attributes'][i]['Base'] + event.player.fullNBT['Attributes'][i]['Modifiers'][0]['Amount'];            
            break;
        }
    }
    return maxHealth;
}
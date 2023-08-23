onEvent('item.food_eaten', event => {

    let preUniqueFoods = event.player.fullNBT['ForgeCaps']['solcarrot:food']['foodList'].length;
    
    event.server.scheduleInTicks(2, callback => {
        let uniqueFoods = event.player.fullNBT['ForgeCaps']['solcarrot:food']['foodList'].length;
		let foodInterval = (uniqueFoods < 10) ? 5 : 10;
		
        if (uniqueFoods > preUniqueFoods) {
            let nextFood = foodInterval - (uniqueFoods % foodInterval);
            if (nextFood == foodInterval) {
                let newHealth = event.player.fullNBT['Health'];
                event.player.tell(Text.of(`The flavors of this world make you stronger! Your new max health is:`).darkAqua().append(Text.of(` ${newHealth}`).darkRed()));
            } else {
                let isSingular = nextFood == 1;
                event.player.tell(Text.of(`New food tasted! You need ${nextFood} more unique food${isSingular ? "" : "s"} to increase your max health.`).darkAqua());
            }
        }        
    });
})
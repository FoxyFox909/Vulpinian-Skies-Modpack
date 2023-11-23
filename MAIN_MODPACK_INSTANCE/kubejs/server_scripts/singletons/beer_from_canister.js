onEvent('block.right_click', event => {

    if (event.item != 'alcocraftvulpinia:mug_empty') {
        return;
    }

    if (event.block != 'createdieselgenerators:canister' || event.hand == 'OFF_HAND') {

        return;
    }

    // Utils.server.tell(event.item);

    // let nbt = event.block.getEntityData().Tanks[0].TankContent.Amount
    let fluidAmount = event.block.getEntityData().Tanks[0].TankContent.Amount
    let rawFluidName = event.block.getEntityData().Tanks[0].TankContent.FluidName
    let fluidName = rawFluidName.slice(rawFluidName.indexOf(':') + 1);


    let matchedFluid;

    if (fluidAmount < 250) {
        return;
    }    

    let beers = [
        'chorus_ale',
        'digger_bitter',
        'drowned_ale',
        'ice_beer',
        'kvass',
        'leprechaun_cider',
        'magnet_pilsner',
        'nether_porter',
        'nether_star_lager',
        'night_rauch',
        'sun_pale_ale',
        'wither_stout',
        'grongle_lambic'
    ];    

    for (let i = 0, len = beers.length; i < len; i++) {
        
        if (beers[i] == fluidName) {
            matchedFluid = beers[i];
            // Utils.server.tell("Found a beer: " + matchedFluid);
            break
        }        
    }

    event.item.count--;
    event.player.giveInHand(`alcocraftvulpinia:mug_of_${matchedFluid}`);

    // Utils.server.tell(event.block.getEntityData().Tanks[0].TankContent.getInt("Amount"))
    // Utils.server.tell("TESST = " + event.block.getEntityData().Tanks[0].TankContent.Amount.toString())
    
    Utils.server.runCommandSilent(`data modify block ${event.block.x} ${event.block.y} ${event.block.z} Tanks[0].TankContent.Amount set value ${fluidAmount - 250}`);
    event.player.playSound('minecraft:block.iron_trapdoor.open', 0.85, 0.9)
    event.player.playSound('minecraft:item.bottle.fill', 0.85, 0.85)
    
    // Utils.server.tell("fluidName = " + fluidName);
    // Utils.server.tell("keys = " + Object.keys(nbt));
    // Utils.server.tell("value = " + nbt);
    // Utils.server.tell("type = " + typeof(nbt));
    // Utils.server.tell("matchedFluid = " + matchedFluid);

});
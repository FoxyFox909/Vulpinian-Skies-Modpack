//priority: 0

onEvent("create.spout.special", event => {
    //Creates a handler for spout, the id is required as there's no way to generate a consistent uuid here.
    //
    //Spout will call the handler with simulate = true for every tick, if the returned value > 0, then
    //the spout will start its animation, handler will be called with simulate = false again at the end of
    //the animation. 
    //
    //The returned integer is how much fluid should this operation consume.
    event.addSpoutHandler("minecraft:obsidian", "minecraft:lava", (block, fluid, simulate) => {
        if (fluid.id == "minecraft:water" && fluid.amount >= 100) {
            if (!simulate) {
                block.setBlockState(Block.getBlock("minecraft:obsidian").defaultBlockState(), 2);
            }
            return 100;
        }
        return 0;
    })

    /*event.addSpoutHandler("alcocraftvulpinia:mug_of_chorus_ale", "alcocraftvulpinia:mug_empty", (block, fluid, simulate) => {
        if (fluid.id == "alcocraftvulpinia:chorus_ale" && fluid.amount >= 250) {

            //let blockRot = 
            Utis.server.tell("Keys = " + Object.keys(block));

            if (!simulate) {
                //block.setBlockState(Block.getBlock("alcocraftvulpinia:mug_of_chorus_ale").defaultBlockState(), 2);
                // block.set('alcocraftvulpinia:cho')
            }
            return 250;
        }
        return 0;
    })*/

    function genMugBlockSpout() {
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
            'wither_stout'
        ];

        beers.forEach(beer => {

            //console.info('Registering spout interaction for ' + beer)

            event.addSpoutHandler(`alcocraftvulpinia:mug_of_${beer}`, "alcocraftvulpinia:mug_empty", (block, fluid, simulate) => {
                if (fluid.id == `alcocraftvulpinia:${beer}` && fluid.amount >= 250) {

                    let mugFacing = block.properties.facing;

                    if (!simulate) {
                        block.set(`alcocraftvulpinia:mug_of_${beer}`, {"facing": mugFacing});
                    }
                    return 250;
                }
                return 0;
            });

        });
    }

    genMugBlockSpout();
});
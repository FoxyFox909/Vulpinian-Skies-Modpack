// priority: 1

/** Handles player persistentData and provides helper functions in global scope for other scripts to us
 *  Currently mainly used by AlcoCraft custom drunkness mechanics
 * 
 * 
*/

const getAlcoData = (serverPlayer) => {
    // Utils.server.tell(player)
    return serverPlayer.persistentData.AlcoData;
}

const getAlcoPoints = (serverPlayer) => {
     /** @type {Internal.CompoundTag} */
     let AlcoData = serverPlayer.persistentData.AlcoData;
    return AlcoData.getInt("AlcoPoints");
}

// serverPlayer is NOT just player. Must be obtained e.g. by event.player.minecraftPlayer or event.server.playerList.players[i])
const addAlcoPoints = (serverPlayer, amount) => {
    /** @type {Internal.CompoundTag} */
    let AlcoData = serverPlayer.persistentData.AlcoData;
    let prevAlcoPoints = serverPlayer.persistentData.AlcoData.AlcoPoints;
    let newAlcoPoints = 0;

    if ((prevAlcoPoints + amount) <= 0) {
        newAlcoPoints = 0;
    } else {
        newAlcoPoints = prevAlcoPoints + amount;
    }
    // console.log("player = " + serverPlayer);

    // console.log("AlcoData = " + AlcoData);
    // console.log("type of amount  = " + typeof(amount)); // Outputs: number
    // console.log("amount = " + amount);

    // console.log("type of prevAlcoPoints  = " + typeof(prevAlcoPoints)); // Outputs: number
    // console.log("prevAlcoPoints = " + prevAlcoPoints);

    // console.log("type of newAlcoPoints  = " + typeof(newAlcoPoints)); // Outputs: number
    // console.log("newAlcoPoints = " + newAlcoPoints);
    AlcoData.putInt("AlcoPoints", newAlcoPoints); // errors with: Cannot convert NaN to java.lang.Integer
    //AlcoData.AlcoPoints = newAlcoPoints; // This turns the value into a double, which i don't want.

    return;
}

// DEPRECATED
// const cleanActiveBeers = (event, index) => { // Helper function for cleaning up ActiveBeers
//     // return event.player.persistentData.AlcoData.ActiveBeers.pop();
//     event.player.persistentData.AlcoData.ActiveBeers.sort(
//         (b1, b2) => (b1.AlcoContent < b2.AlcoContent) ? 1 : (b1.AlcoContent > b2.AlcoContent) ? -1 : 0);
//     event.player.persistentData.AlcoData.ActiveBeers.pop();
// }

/** @returns {Internal.ListTag} */
const getAlcoAngle = (serverPlayer) => {
    return serverPlayer.persistentData.AlcoData.AlcoAngle;
}

const setAlcoAngle = (serverPlayer, value) => {
    /** @type {Internal.CompoundTag} */
    let AlcoData = serverPlayer.persistentData.AlcoData;
    AlcoData.putFloat("AlcoAngle", value);
    return AlcoData.getFloat("AlcoAngle");
}

const genClearAlcoData = (player) => {
    player.persistentData.put("AlcoData", NBT.toTagCompound({}));

    /** @type {Internal.CompoundTag} */
    let AlcoData = player.persistentData.AlcoData // now it recognizes
    AlcoData.putInt("AlcoPoints", 0);
    AlcoData.putFloat("AlcoAngle", 0.0);
    AlcoData.put("ActiveBeers", NBT.toTagList([]))
    return;
}

const genBeerObject = (beerId, alcoContent, rate) => {    
    /** @type {Internal.CompoundTag} */
    let beerObj = NBT.toTagCompound({});
    
    beerObj.putString("ID", beerId);
    beerObj.putInt("AlcoContent", alcoContent);
    beerObj.putInt("Rate", rate);    
    return beerObj;
}

const addActiveBeer = (serverPlayer, beerObj) => {    
     /** @type {Internal.ListTag} */
     let ActiveBeers = serverPlayer.persistentData.AlcoData.ActiveBeers
    //  Utils.server.tell("ActiveBeers: " + serverPlayer.persistentData.AlcoData.ActiveBeers)

     ActiveBeers.add(0, beerObj);
    return;
}

onEvent('server.load', event => {
    
    //event.server.persistentData.vulpinianPlayerData = null ?? [];

    // JSON Schema: [{"StringUUID": "stringUUID", "PlayerName": "Aurora Luciri" }]

    //event.server.persistentData.
});

// onEvent('player.logged_in', event => {

    
    // //if (event.player.persistentData.alcocraftVulpinia == (null || undefined)) {

    // event.server.scheduleInTicks(100, () => {

        // // console.info("Attempting to give data to player " + event.player);
        // // console.info("AlcoData: " + event.player.persistentData);
        
        // if (event.player.persistentData.AlcoData == null || event.player.persistentData.AlcoData == {}) {

            // console.info("Detected Null or Undefined AlcoData for " + event.player.name.conents);
            // //event.player.persistentData.alcocraftVulpinia = null ?? {Drunkness:{"Level":0, "Beers":[]}};
            // // event.player.persistentData.AlcoData.putFloat('AlcoPoints', 0.0);
            // // event.player.persistentData.AlcoData = {AlcoPoints:0.0, AlcoAngle:0.0, ActiveBeers:[]};

            // genClearAlcoData(event.player);

            // console.info("Generated AlcoData for " + event.player + " for the first time.");
         // }
         // if (event.player.persistentData.AlcoData.AlcoPoints < 0) {
            // event.player.persistentData.AlcoData.AlcoPoints = 0;
         // }

    // })


// })

onEvent('command.registry', event => {
    const { commands: Commands, arguments: Arguments} = event;

    event.register(
		Commands.literal('vulpinia')
        .requires(src => src.hasPermission(2))
            .then(Commands.literal('playerdata')
                .then(Commands.literal('get')
                    .then(Commands.argument('player-name', Arguments.STRING.create(event))
                        .executes(ctx => {
                            const pName = Arguments.STRING.getResult(ctx, "player-name");                                   

                            // const pos = ctx.source.position                                    
                            //Utils.server.tell('Name: ' + ctx.playerOrException);

                            //  Utils.server.tell('Key: ' + Object.keys(ctx.source.playerOrException));

                            // Utils.server.tell('Total data: ' + ctx.source.playerOrException.persistentData);
                            // Utils.server.tell('Total data: ' + ctx.source.playerOrException.persistentData);

                            // Utils.server.tell('Value: ' + ctx.source.playerOrException.persistentData.AlcocraftVulpinia);
                            // Utils.server.tell('Typeof: ' + typeof(ctx.source.playerOrException.persistentData.AlcocraftVulpinia));
                            // Utils.server.tell('Typeof: ' + ctx.source.playerOrException);
                            //ctx.source.playerOrException.persistentData.AlcocraftVulpinia = {Level:0.0, Beers:[]};

                            /*if (ctx.source.playerOrException.persistentData.AlcocraftVulpinia == null) {
                                Utils.server.tell("It's null.")
                                return 0;
                            }*/

                            // Utils.server.tell('Total data: ' + ctx.source.playerOrException.persistentData);                        
                            //Utils.server.tell('Value: ' + ctx.source.playerOrException.persistentData.AlcocraftVulpinia);
                            //Utils.server.tell('Players: ' + Object.keys(ctx.source.server.playerList.players[0]));
                            //Utils.server.tell('Players: ' + ctx.source.server.playerList.players.length);

                            for (let i = 0, len = ctx.source.server.playerList.players.length; i < len; i++) {
                                if (pName != ctx.source.server.playerList.players[i].name.contents) {
                                    continue;
                                }
                                
                                    
                                //Utils.server.runCommandSilent("AlcoData: " + ctx.source.server.playerList.players[i].persistentDataKJS.AlcoData);


                                // Utils.server.runCommandSilent(`tell ${ctx.source.playerOrException.name.contents} Data = ${ctx.source.server.playerList.players[i].persistentDataKJS.AlcoData}`);

                                // Utils.server.runCommandSilent(`tell ${ctx.source.playerOrException.name.contents} Data = ${ctx.source.server.playerList.players[i].persistentDataKJS.AlcoData.AlcoPoints}`);
                                let player = ctx.source.server.playerList.players[i]
                                Utils.server.runCommandSilent(`tell ${ctx.source.playerOrException.name.contents} Data = ${getAlcoData(player)}`);

                                return 1;
                            }                                                                                
                            Utils.server.runCommandSilent(`tell ${ctx.source.playerOrException.name.contents} Player not found.`);
                            return 0;
                        })
                    )	
                )
                .then(Commands.literal('clear')
                    .then(Commands.argument('player-name', Arguments.STRING.create(event))
                        .executes(ctx => {
                            const pName = Arguments.STRING.getResult(ctx, "player-name");                                   

                            //ctx.source.playerOrException.persistentDataKJS.AlcoData = {Level:0.0, Beers:[]}
                            //Utils.server.tell(ctx.source.playerOrException + " persistentData is type: " + typeof(ctx.source.playerOrException.persistentData.AlcocraftVulpinia));
                            //Utils.server.tell(ctx.source.playerOrException + "'s persistentData: " + ctx.source.playerOrException.persistentDataKJS);

                            
                            for (let i = 0, len = ctx.source.server.playerList.players.length; i < len; i++) {
                                if (pName != ctx.source.server.playerList.players[i].name.contents) {
                                    continue;
                                }
                                
                                /** @type {Internal.CompoundTag} */
                                // let AlcoData = ctx.source.server.playerList.players[i].persistentDataKJS.AlcoData = {AlcoPoints:0.0, ActiveBeers:[], AlcoAngle:0};
                                
                                let player = ctx.source.playerOrException
                                // Utils.server.runCommandSilent(`tell ${ctx.source.playerOrException.name.contents} Data was = ${ctx.source.server.playerList.players[i].persistentDataKJS.AlcoData}`);
                                event.server.runCommandSilent(`tell ${ctx.source.playerOrException.name.contents} Data was = ${getAlcoData(player)}`);

                                genClearAlcoData(player);
                                // AlcoData = NBT.toTagCompound({});
                                // Utils.server.runCommandSilent(`tell ${ctx.source.playerOrException.name.contents} Data is now = ${ctx.source.server.playerList.players[i].persistentDataKJS.AlcoData}`);
                                event.server.runCommandSilent(`tell ${ctx.source.playerOrException.name.contents} Data is now = ${getAlcoData(player)}`);
                                return 1;
                            }                            
                            Utils.server.runCommandSilent(`tell ${ctx.source.playerOrException.name.contents} Player not found.`);
                            return 0;
                        })
                    )
                )
                .then(Commands.literal('add-alcopoints')
                    .then(Commands.argument('player-name', Arguments.STRING.create(event))
                        .then(Commands.argument('amount', Arguments.INTEGER.create(event))
                            .executes(ctx => {
                                const pName = Arguments.STRING.getResult(ctx, "player-name");                                   
                                const amount = Arguments.INTEGER.getResult(ctx, "amount");                                   

                                
                                for (let i = 0, len = ctx.source.server.playerList.players.length; i < len; i++) {
                                    if (pName != ctx.source.server.playerList.players[i].name.contents) {
                                        continue;
                                    }

                                    let player = ctx.source.server.playerList.players[i];
                                    addAlcoPoints(player, amount);                                    

                                    Utils.server.runCommandSilent(`tell ${ctx.source.playerOrException.name.contents} Data is now = ${getAlcoData(player)}`);
                                    return 1;
                                }                                                        
                                Utils.server.runCommandSilent(`tell ${ctx.source.playerOrException.name.contents} Player not found.`);
                                return 0;
                            })
                        )
                    )	
                )
            )
    )	
})




//Potential other ways to schedule events

/*onEvent('server.load', event => {
    event.server.scheduleInTicks(20, (callback) => {
        Utils.server.tell("Done stuff");
        
        callback.reschedule();
    });
})*/


//global.tick20 = 0;
/*onEvent('server.tick', event => {
    if (event.server.allLevels[1].time % 20 == 0) {
        //do stuff
        Utils.server.tell("Server done stuff")
    }

    //Utils.server.tell("tick20 = " + global.tick20);

    /*global.tick20++
    if (global.tick20 == 20) {
        global.tick20 = 0;

        Utils.server.tell('Stuff done');
    }*/

//})

/*
onEvent('level.tick', event => {
    if(event.level.dimension != "minecraft:overworld") return 

    if (event.level.time % 20 == 0) {

        Utils.server.tell('done stuff');
    }

});*/


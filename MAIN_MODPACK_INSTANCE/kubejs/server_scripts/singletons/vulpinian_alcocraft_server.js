// Priority: 0

// Base amount of chance of sickness added by single drunkPoint
// Converted to percent chance, current is 0.00085% per alcopoint
// This yeields a little over 8 sicknesses per 8 minutes of having drunk 5 beers
// With a little over that, given the jumps by 
const alcoPointConvRate = 0.000085;

const alcoPointdecay = 1;           /* Base Amount of AlcoPoints reduced AND granted per second */
const baseAlcoContent = 100;         /* Base amount of total AlcoPoints granted from a beer */
const baseRate = 80;                /* Base rate for AlcoPoints gained from beer over time, in seconds */

/**Drunkness over Time!
 *  
 * ActiveBeers are stored in player persistentData
 * Array is iterated every 20 player ticks
 * Every beer contributes to the player's AlcoPoints
 * depending on its remaining AlcoPoints and rate
 * 
*/
function alcoPointsFromBeer(event, rate) {

    let alcoContent = event.item.getNbt().getInt('AlcoContent');
    let beerInitialFraction = Math.round(alcoContent * 0.20); // Given as AlcoPoints immediately to the player */
    let beerRemainderFraction = Math.round(alcoContent * 0.80); // Spread out over seconds governed by rate */

    rate = null ?? baseRate;

    // Utils.server.tell("beerRemainderFraction = " + beerRemainderFraction);
    addAlcoPoints(event.player.minecraftPlayer, beerInitialFraction);

    let beerId = event.item.id;

    // Utils.server.tell(beerId)
    // let beerObject = {id: beerId, AlcoContent: beerRemainderFraction, rate: (beerRemainderFraction / rate)};

    let beerObj = genBeerObject(beerId, beerRemainderFraction, beerRemainderFraction / rate);
    addActiveBeer(event.player.minecraftPlayer, beerObj);    
}

function tickBeers(serverPlayer) {
    /** @type {Internal.ListTag} */
    let activeBeers = getAlcoData(serverPlayer).ActiveBeers;
    // Utils.server.tell("activeBeers = " + activeBeers)
    if (activeBeers.length > 0) { 
        for (let i = 0, len = activeBeers.length; i < len; i++) {
            /** @type {Internal.CompoundTag} */
            let nextBeer = activeBeers[i]
            let alcoContent = nextBeer.getInt("AlcoContent");

            if (alcoContent <= 0) {
                activeBeers.remove(i);
                continue;
            }

            let rate = nextBeer.getInt("Rate");
            let nextAlcoContent = alcoContent - rate;

            // Utils.server.tell("nextBeer = " + nextBeer)
            addAlcoPoints(serverPlayer, rate);
            nextBeer.putInt("AlcoContent", nextAlcoContent);
        }            
    }
}

function rollSickness(event) {

    let ap = getAlcoPoints(event.player.minecraftPlayer)

    if (ap <= 0) {
        return;
    }

    let nextFloat = Math.random();

    //Utils.server.tell("nextFloat: " + nextFloat);
    
    //0.00085% of drunknpess points are converted to the percent chance of getting sick
    let chanceFromAlcoPoints = ap * alcoPointConvRate;
    
    //5% chance each second 
    //if (nextFloat < 0.05) {
    if (nextFloat < chanceFromAlcoPoints) {
        
        let nauseaDuration = 20 * (chanceFromAlcoPoints * getRandomArbitrary(20.0, 50.0)) + 20;
        // Utils.server.tell("Triggered sickness with duration = " + (nauseaDuration / 20) + " seconds.");
        //	public void add(MobEffect mobEffect, int duration, int amplifier, boolean ambient, boolean showParticles)
        event.player.potionEffects.add('minecraft:nausea', nauseaDuration, 1, false, true);

    }
}

function rollStumble(event) {
	// Utils.server.tell("rolling stumble");
    let ap = getAlcoPoints(event.player.minecraftPlayer);
    if (ap <= 0) {
        return;
    }

    let nextFloat = Math.random();
    let chanceFromAlcoPoints = (ap * alcoPointConvRate) * 2;

    if (nextFloat < chanceFromAlcoPoints) {			
        stumble(event);
    }
}

function stumble(event) {

    let prevAngle = getAlcoAngle(event.player.minecraftPlayer);
    let nextAngle = setAlcoAngle(event.player.minecraftPlayer, (prevAngle + ((Math.random() -0.5) * 2)));

    // Utils.server.tell("nextAnge = " + nextAngle); // logging

    // let nextX = (Math.random() * 2) - 1;
    // let nextZ = (Math.random() * 2) - 1;

    // let angle = (Math.random() * (3.14 * 2));
    //let angle = (nextAngle * (3.14 * 2));

    // Utils.server.tell("angle: " + angle);

    let ap = getAlcoPoints(event.player.minecraftPlayer);

    let distance = 0.25;
    let bonus_dist = (ap * alcoPointConvRate) * getRandomArbitrary(1.0, 5.0);

    distance += bonus_dist;
    // Utils.server.tell("Bonus distanece = " + bonus_dist);

    let distX = Math.sin(nextAngle) * distance;
    let distZ = Math.cos(nextAngle) * distance;

    // event.entity.setMotion(distX, 0, distZ);
    // event.player.minecraftEntity.hurtMarked = true;
    
    // event.entity.addMotion(distX * 10, 0.0, distZ * 10);
    // event.entity.setMotion(distX * 10, 0.0, distZ * 10);

    event.player.minecraftEntity.hurtMarked = true;
    event.entity.setMotionX(distX + bonus_dist);
    event.player.minecraftEntity.hurtMarked = true;
    event.entity.setMotionZ(distZ + bonus_dist);
    event.player.minecraftEntity.hurtMarked = true;

    // Utils.server.tell("nextAngle = " + nextAngle);
    
    
    // event.player.minecraftEntity.hurtMarked = true;


    // let dist = Math.sqrt(nextX*nextX + nextZ*nextZ);

    // event.entity.setMotion(nextX, 0, nextZ);

}

function rollBlackout(event) {
    let playerName = event.player.name.contents;
    let ap = getAlcoData(event.player.minecraftPlayer).AlcoPoints;
    let chanceFromAlcoPoints = ap * alcoPointConvRate;    

    let nextFloat = Math.random();
    if (nextFloat < chanceFromAlcoPoints) {
        
        const kickMessages = [
            `${playerName} had too much to drink.`,
            `${playerName} partied a little too hard.`,
            `${playerName} went to take an alcohol-powered nap.`,
            `Congratulations to ${playerName}, through the power of alcohol they transcended into the realm of the unknown. Hope they're ready to tackle their demons!`
        ]
    
        let selectedIndex = Math.floor(Math.random() * kickMessages.length);
        let selectedMessage = kickMessages[selectedIndex];
        
        Utils.server.runCommandSilent(`vulpinia playerdata add-alcopoints ${playerName} -2500`);
        randomBlackoutTp(event, 200, true);
        Utils.server.runCommandSilent(`kick ${playerName} ${selectedMessage}`);
        Utils.server.runCommandSilent(`tellraw @a "${selectedMessage}"`); 
    }
}


onEvent('item.food_eaten', event => {
    let isMug = event.item.hasTag('alcocraftvulpinia:beer_mugs');
    
    if (!isMug) {
        return;
    }        

    alcoPointsFromBeer(event);
});

function randIntRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

 /**
 * Random Teleport Function
 * @param {number} randomTpRadius - Up to how many blocks in any direction the player may get teleported.
 * E.G.: with a value of 200, a player could end up x-150 and z-50 relative to where they were.
 * but no further.
 * @param {boolean} shouldRandomizeDim - Whether or not a new dimension can be chosen for the random teleport.
 */ 
function randomBlackoutTp(event, randomTpRadius, shouldRandomizeDim) {
    let buildLimitUp = 0;
    let buildLimitDown = 0;    

    let rtpMin = (randomTpRadius / 2) * -1;
    let rtpMax = (randomTpRadius / 2) + 1;
    
    let selectedLevel;

    const playerX = Math.floor(event.player.x);
    const playerZ = Math.floor(event.player.z);

    if (!shouldRandomizeDim) {
        selectedLevel = event.player.level
    } else {
        let serverLevels = event.server.getAllLevels(); // Array of levels (dimensions) installed, vanill and modded.
        selectedLevel = serverLevels[Math.floor(Math.random() * serverLevels.length)];

        //To check what dimensions are being detected as installed
        // for (let i = 0, len = serverLevels.length; i < len; i++ ) {
        //     let nextLevel = serverLevels[i];
        //     Utils.server.tell("Dim: " + nextLevel.dimension);
        // }

        // Utils.server.tell("selected dim = " + selectedLevel.dimension)   
        console.info("Selected dimension for blackout for " + event.player + ": " + selectedLevel.dimension);
    }

    switch(selectedLevel.dimension) {
        case "minecraft:overworld":
            buildLimitUp = 319;
            buildLimitDown = -64;
            break;
        case "minecraft:the_nether":
            buildLimitUp = 127;
            buildLimitDown = 0;
            break;
        case "minecraft:the_end":
        case "undergarden:undergarden":
            buildLimitUp = 255;
            buildLimitDown = 0;
            break;
    }

    // rng location sanity checker. CONSOLE SPAM.
    // for (let i = 0, len = 100; i < len; i++) {
    //     let next_x = randIntRange(rtpMin, rtpMax);
    //     let next_z = randIntRange(rtpMin, rtpMax);
    //     Utils.server.tell("next random location is blocks away: " + (next_x + next_z));
    // }

    /**
     * Attempts to find a suitable spawning spot with a dynamic search range
     * depending on the chosen randomTpRadius.
     * 
     * If it cannot find a suitable spawning spot, it gives up.
     */
    for (let i = 0, len = rtpMax; i < len; i++) {

        const randDistanceX = randIntRange(rtpMin, rtpMax);
        const randDistanceZ = randIntRange(rtpMin, rtpMax);
    
        const selectedBlockX = playerX + randDistanceX; //211
        const selectedBlockZ = playerZ + randDistanceZ; //2156
        // Utils.server.tell("block = " + Object.keys(playerLevel.getBlock(selectedBlockX, 0, selectedBlockZ)))

        let foundFirstAir = false;

        for (let j = buildLimitUp; j >= buildLimitDown; j--) {
            let nextBlock = selectedLevel.getBlock(selectedBlockX, j, selectedBlockZ);
            let nextBlockId = nextBlock.id;
            let isAir = nextBlockId === 'minecraft:air' || nextBlockId === 'minecraft:void_air' || nextBlockId === 'minecraft:cave_air' || nextBlockId === 'minecraft:structure_void';    
            
            if (!foundFirstAir) {
                foundFirstAir = isAir;
            }

            // WARNING CONSOLE SPAM
            // Utils.server.tell("nextBlock at y = " + j + " is " + nextBlock.id)
    
            if (!isAir) {
                // This ensures the player will not be suffocated in "roofed" dimensions like the Nether.
                if (!foundFirstAir) {
                    continue;
                }
                
                let blockProperties = String(nextBlock.getProperties())
                // Fluids have level in their property, so this is a cheeky way to detect them.
                // Reading tags did not work, and checking for individual IDs is cumbersome.
                let isFluid = blockProperties.includes("level")

                // Utils.server.tell(selectedBlockX + ", " + selectedBlockZ + " is NOT air");
                // Utils.server.tell("nextBlock.getUp = " + nextBlock.getUp());
                // Utils.server.tell(nextBlock.id + " has tags: " + isFluid);

                if (!isFluid) {             
                    event.player.teleportTo(selectedLevel.dimension, selectedBlockX + 0.5, j + 1, selectedBlockZ + 0.5, 90.0, -2.5);
                } else {
                    let blockAbove = nextBlock.getUp();

                    if (blockAbove.getWest().id == "minecraft:air") {
                        blockAbove.getWest().set("minecraft:obsidian");
                    }
                    
                    if (blockAbove.getEast().id == "minecraft:air") {
                        blockAbove.getEast().set("minecraft:obsidian");
                    }

                    if (blockAbove.getNorth().id == "minecraft:air") {
                        blockAbove.getNorth().set("minecraft:obsidian");
                    }

                    if (blockAbove.getSouth().id == "minecraft:air") {
                        blockAbove.getSouth().set("minecraft:obsidian");
                    }

                    blockAbove.set("minecraft:obsidian");
                    event.player.teleportTo(selectedLevel.dimension, selectedBlockX + 0.5, j + 2, selectedBlockZ + 0.5, 90.0, -2.5);
                }
                return;
            }            
        }
    }
}

// onEvent('player.chat', (event) => {
//     // Utils.server.tell("keys= " + Object.keys(event))
//     // event.setMessage(Text.of("<" + event.username + "> " + event.message).hover("test"));

//     // event.player.message = Text.of("<" + event.username + "> " + event.message).hover("test")
//     event.setMessage(event.message.trim());
//     // event.cancel();

//     // event.setMessage(null)
// });



//Roll every second for chance of drunkness-related effect
onEvent('player.tick', event => {

    
    
    let ap = getAlcoData(event.player.minecraftPlayer).AlcoPoints;

    if (ap <= 0) {
        return;
    }

    if (event.player.ticksExisted % 20 == 0) {
    
        
        // let chance = ap * alcoPointConvRate;

        tickBeers(event.player.minecraftPlayer);

        // stumble(event);
        // rollSickness(event);

        // Utils.server.tell("chance from AlcoPoints = " + chance);
		
		// Utils.server.tell("AlcoPoints = " + ap);
        
        //   ENABLE
        rollSickness(event); 
        
        //  ENABLE
        if (ap >= 500) {
            rollStumble(event);
        }

        //  ENABLE
        if (ap >= 2500) {
            rollBlackout(event);
        }

        //Utils.server.tell("AlcoPoints = " + ap)
        //Utils.server.tell("AlcoPoints = " + getAlcoData(event));
        
        // Slowly ticks down player's AlcoPoints, to simulate their system detoxifying the alcohol slowly.
        // Default rate is one alcohol lost per second.
        // This allows a player to have one (light, rate of 1 AlcoPoint per alcohol tick) beer without getting very drunk
        // (Only initial beer AlcoPoints will be given, but additional AlcoPoints won't raise, will be stable)
        if (ap > 0) {
            addAlcoPoints(event.player.minecraftPlayer, -1);
        }
    }
});

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
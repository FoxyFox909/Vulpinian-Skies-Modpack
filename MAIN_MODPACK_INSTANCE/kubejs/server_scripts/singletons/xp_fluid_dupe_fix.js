//Double Dupe fix - preventing XP and fluid duplication via Copper Tanks and Capsules

onEvent('block.place', event => { //block.place is used because that is the event triggered by picking up blocks with capsules
	
	if (event.block.id == 'create:fluid_tank') {		
		if (event.block.entity.getFluidLevel().value) {	//Checks if the event block is the Controller of the tank multiblock
			
			let tankX = event.block.getX();
			let tankY = event.block.getY();
			let tankZ = event.block.getZ();			
			
			event.server.scheduleInTicks(1, callback => {
				//Prevents duping of XP
				//0 ticks of delay, and the XP will not be killed at all
				//>1 ticks of delay, and the player can dupe some meaningful XP
				Utils.server.runCommandSilent(`execute positioned ${tankX} ${tankY + 1} ${tankZ} run kill @e[type=minecraft:experience_orb,distance=..10]`);
			});			
			
			//Empties any residue in tanks above a tank
			//This will indiscriminately target a separate tanky at tank build height,
			//but this is a somewhat extreme edge case, and unlikley to happen
			//Emptying the residue on the tanks above will ensure no fluid dupe happens
			//Otherwise, no loss happens when players pick up the whole tank with a capsule, and not part of the multiblock
			
			event.server.scheduleInTicks(6, callback => { //Need some delay so that the new tank multiblock properly rebuilds itself, and the command can be run
				Utils.server.runCommandSilent(`data merge block ${tankX} ${tankY + 1} ${tankZ} {TankContent:{Amount:0}}`);				
			});			
		}				
	}	
})
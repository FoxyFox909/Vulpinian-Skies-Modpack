function loginProtecc(event) {

    console.info(`Running loginProtecc for Player ${event.player.name.contents}`);

    let playerInput = false;

    let startingYaw = event.player.yaw;
    let startingPos = getPos(event);

    let playerMoved = false;
    let cameraMoved = false;

    let delayFlag = true;

    event.player.setInvulnerable(true);

    function checkForInput(event, previousCamera) {
        event.server.scheduleInTicks(8, callback => {
            //Utils.server.tell('playerInput = ' + playerInput);

            cameraMoved = startingYaw != event.player.yaw;
            playerMoved = !startingPos.every((val, index) => val === getPos(event)[index]);

            if (playerMoved) {

                // When player moves, immediately ends grace period.
                playerInput = true;
            }

            if (cameraMoved && delayFlag) {
                
                // When player moves camera, starts a timer that lets them get their bearings and look around a little
                // before their grace period is ended.
                delayFlag = false;
                event.server.scheduleInTicks(48, callback2 => {
                    playerInput = true;
                });
            }

            if (playerInput) {
                event.player.setInvulnerable(false);
                console.info(`Detected input from Player ${event.player.name.contents}. Grace period ended.`);
                return;
            } else {
                checkForInput(event);
            }
        });
    }

    return checkForInput(event);
    
}

function getPos(event) {
    let pos = [];

    pos.push(event.player.x);
    pos.push(event.player.y);
    pos.push(event.player.z);

    return pos;
	
}


/* For testing
onEvent('item.entity_interact', event => {

	if (event.target.type == "minecraft:fox" && event.item.id == "minecraft:diamond") {

        loginProtecc(event);
        
    }	
}) */

onEvent('player.logged_in', event => {

    loginProtecc(event);
    
});

onEvent('player.change_dimension', event => {
    
    loginProtecc(event);

});
// priority: 0
// SERVER SIDE ONLY
console.info('Setting up custom Weather blocks (server)');

onEvent('block.registry', event => {
	event.create('weather2:weather_deflector')
		.material('metal')
		.hardness(2.0)
		.resistance(6.0)
		.notSolid()
		.requiresTool(true);
})
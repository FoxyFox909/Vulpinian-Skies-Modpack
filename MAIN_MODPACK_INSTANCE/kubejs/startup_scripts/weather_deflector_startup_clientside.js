// priority: 0

console.info('Setting up custom Weather blocks');

const $ItemBlockRenderTypes = java('net.minecraft.client.renderer.ItemBlockRenderTypes');
const $RenderType = java('net.minecraft.client.renderer.RenderType');
const $Blocks = java('weather2.WeatherBlocks');
const $DeflectorBlock = java('weather2.block.DeflectorBlock');

onEvent('block.registry', event => {
	event.create('weather2:weather_deflector')
		.material('metal')
		.hardness(2.0)
		.resistance(6.0)
		.notSolid()
		.requiresTool(true);
	
})

onEvent('postinit', event => {

	$ItemBlockRenderTypes['setRenderLayer(net.minecraft.world.level.block.Block,java.util.function.Predicate)']($Blocks.BLOCK_DEFLECTOR.get(), renderType => {
		return (renderType == $RenderType.cutout())
	});	
})
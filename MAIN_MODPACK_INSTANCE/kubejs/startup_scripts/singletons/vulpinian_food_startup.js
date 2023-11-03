// priority: 0

const modpackNamespace = 'vulpinian_skies_core'

const $Item = java('net.minecraft.world.item.Item');
const $BlockProperties = java('net.minecraft.world.level.block.state.BlockBehaviour$Properties');
const $CakeBlock = java('net.minecraft.world.level.block.CakeBlock');
const $Material = java('net.minecraft.world.level.material.Material');
const $FoodProperties = java('net.minecraft.world.food.FoodProperties');
const $MobEffectInstance = java('net.minecraft.world.effect.MobEffectInstance');
const $MobEffects = java('net.minecraft.world.effect.MobEffects');

const $UGEffects = java('quek.undergarden.registry.UGEffects')

const $ItemProperties = java('net.minecraft.world.item.Item$Properties');
const $BlockItem = java('net.minecraft.world.item.BlockItem');

const $PieBlock = java('vectorwing.farmersdelight.common.block.PieBlock');

 // Farmer's Delight will automatically pass on
 // the food properties of the pie slice item,
 // to the pie block item.
 let gloomgourdPieSlice = Utils.getRegistry('minecraft:item')
    .register(`${modpackNamespace}:gloomgourd_pie_slice`,
        () => new $Item(new $ItemProperties()
        .stacksTo(64)
        .food(new $FoodProperties
            .Builder()
            .nutrition(4)
            .saturationMod(2.0)
            .effect(() => new $MobEffectInstance($MobEffects.GLOWING, 600, 0, false, true), 1.0)
            .effect(() => new $MobEffectInstance($MobEffects.NIGHT_VISION, 600, 0, false, true), 1.0)
            .effect(() => new $MobEffectInstance($UGEffects.VIRULENT_RESISTANCE.get(), 600, 0, false, true), 1.0)
            .build())));

 let gloomgourdPie = Utils.getRegistry('minecraft:block')
    .register(`${modpackNamespace}:gloomgourd_pie`,
        () => new $PieBlock($BlockProperties.of($Material.AMETHYST), () => gloomgourdPieSlice.get()));

// This registers the BlockItem that places the actual pie block registered above.
 Utils.getRegistry('minecraft:item')
    .register(`${modpackNamespace}:gloomgourd_pie`,
        () => new $BlockItem(gloomgourdPie.get(), new $ItemProperties().stacksTo(64)));

onEvent('item.registry', event => {

    event.create('vulpinian_skies_core:grongle_sugar')
		.displayName('Grongle Sugar')
		// .tooltip(Text.darkAqua('Forbidden item - secret currency. Only obtainable by Admins.'))
		.texture('vulpinian_skies_core:item/grongle_sugar').maxStackSize(64).rarity('rare');

})
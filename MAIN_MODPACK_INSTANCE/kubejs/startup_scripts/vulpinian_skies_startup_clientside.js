// priority: 0
// CLIENT SIDE ONLY

onEvent('postinit', event => {

//Mysterious Conversion Recipes via reflection
let MysteriousItemConversionCategory = java('com.simibubi.create.compat.jei.category.MysteriousItemConversionCategory')
let ConversionRecipe = java('com.simibubi.create.compat.jei.ConversionRecipe')

//Mysterious Conversion
MysteriousItemConversionCategory.RECIPES.add(ConversionRecipe.create('minecraft:glass_bottle', 'quark:bottled_cloud'))

})
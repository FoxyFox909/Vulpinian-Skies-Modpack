/*
	Custom conversions for modpack's currency, using Create Deco

	Zinc Coin -> Brass Coin -> Copper Coin -> Cast Iron Coin -> Iron Coin -> Gold Coin -> Netherite Coin
	8 of any coin = 1 coinstack
	
	Coin conversions:
	32 ZC = 1 BC
	64 ZC = 1 CC
	2 BC = 1 CC
	64 BC = 1 CIC
	32 CC = 1 CIC
	2 CIC = 1 IC
	64 CC = 1 IC
	64 IC = 1 GC 
	64 GC = 1 NC
	*/
	
	
onEvent('recipes', event => {
	//New stack sizes
	let vulpinianCoins = ["zinc", "brass", "copper", "cast_iron", "iron", "gold", "netherite"];
	for (let i = 0; i < vulpinianCoins.length; i++) {
		
		event.remove({id:`createdeco:${vulpinianCoins[i]}_coinstack`});
		event.remove({id:`createdeco:${vulpinianCoins[i]}_coin`});
		
		event.shapeless(`createdeco:${vulpinianCoins[i]}_coinstack`, `8x createdeco:${vulpinianCoins[i]}_coin`);
		event.shapeless(`8x createdeco:${vulpinianCoins[i]}_coin`, `createdeco:${vulpinianCoins[i]}_coinstack`);
	};
	
	//Zinc <--> Brass
	event.shapeless('createdeco:brass_coin', '32x createdeco:zinc_coin');
	event.shapeless('32x createdeco:zinc_coin', 'createdeco:brass_coin');
	
	event.shapeless('createdeco:brass_coin', '4x createdeco:zinc_coinstack');
	event.shapeless('4x createdeco:zinc_coinstack', 'createdeco:brass_coin');
	
	//Zinc <--> Copper
	event.shapeless('createdeco:copper_coin', '64x createdeco:zinc_coin');
	event.shapeless('64x createdeco:zinc_coin', 'createdeco:copper_coin');
	
	event.shapeless('createdeco:copper_coin', '8x createdeco:zinc_coinstack');
	event.shapeless('8x createdeco:zinc_coinstack', 'createdeco:copper_coin');
	
	//Brass <--> Copper
	event.shapeless('createdeco:copper_coin', '2x createdeco:brass_coin');
	event.shapeless('2x createdeco:brass_coin', 'createdeco:copper_coin');
	
	event.shapeless('createdeco:copper_coinstack', '2x createdeco:brass_coinstack');
	event.shapeless('2x createdeco:brass_coinstack', 'createdeco:copper_coinstack');
	
	//Brass <--> Cast Iron
	event.shapeless('createdeco:cast_iron_coin', '64x createdeco:brass_coin');
	event.shapeless('64x createdeco:brass_coin', 'createdeco:cast_iron_coin');
	
	event.shapeless('createdeco:cast_iron_coin', '8x createdeco:brass_coinstack');
	event.shapeless('8x createdeco:brass_coinstack', 'createdeco:cast_iron_coin');
	
	//Copper <--> Cast Iron
	event.shapeless('createdeco:cast_iron_coin', '32x createdeco:copper_coin');
	event.shapeless('32x createdeco:copper_coin', 'createdeco:cast_iron_coin');
	
	event.shapeless('createdeco:cast_iron_coin', '4x createdeco:copper_coinstack');
	event.shapeless('4x createdeco:copper_coinstack', 'createdeco:cast_iron_coin');
	
	//Cast Iron <--> Iron
	event.shapeless('createdeco:iron_coin', '2x createdeco:cast_iron_coin');
	event.shapeless('2x createdeco:cast_iron_coin', 'createdeco:iron_coin');
	
	event.shapeless('createdeco:iron_coinstack', '2x createdeco:cast_iron_coinstack');
	event.shapeless('2x createdeco:cast_iron_coinstack', 'createdeco:iron_coinstack');
	
	//Copper <--> Iron
	event.shapeless('createdeco:iron_coin', '64x createdeco:copper_coin');
	event.shapeless('64x createdeco:copper_coin', 'createdeco:iron_coin');
	
	event.shapeless('createdeco:iron_coin', '8x createdeco:copper_coinstack');
	event.shapeless('8x createdeco:copper_coinstack', 'createdeco:iron_coin');

	//Iron <--> Gold
	event.shapeless('createdeco:gold_coin', '64x createdeco:iron_coin');
	event.shapeless('64x createdeco:iron_coin', 'createdeco:gold_coin');
	
	event.shapeless('createdeco:gold_coin', '8x createdeco:iron_coinstack');
	event.shapeless('8x createdeco:iron_coinstack', 'createdeco:gold_coin');
	
	//Gold <--> Netherite
	event.shapeless('createdeco:netherite_coin', '64x createdeco:gold_coin');
	event.shapeless('64x createdeco:gold_coin', 'createdeco:netherite_coin');
	
	event.shapeless('createdeco:netherite_coin', '8x createdeco:gold_coinstack');
	event.shapeless('8x createdeco:gold_coinstack', 'createdeco:netherite_coin');

})
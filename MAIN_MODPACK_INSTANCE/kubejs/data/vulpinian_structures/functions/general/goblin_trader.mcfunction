summon goblintraders:goblin_trader ~ ~ ~ {PersistenceRequired:1b}
fill ~ ~ ~ ~ ~1 ~ minecraft:air
kill @e[type=item,distance=..5,limit=1,nbt={Item:{id:"minecraft:light_weighted_pressure_plate"}}]
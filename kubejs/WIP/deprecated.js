if (cardTag == "Vulpine Co. [stage1-valid]") {
							if (entityData.stages.has('ga_registered_player')) {event.server.tell("Found a valid Card, but you are already registered!"); return;}
							if (currentPlayersCount().length >= maxPlayers) {event.server.tell("Found a valid Card, but player slots are full! Please wait until the next match."); return;}
							//if (matchOngoing) {event.server.tell("Found a valid Card, but a match is currently underway! Please wait until the next match. Go watch some pew pews in the meantime :)"); return;} future-proofing
							let nameString = entityData.getInventory().getItem(slot).getTag().display.Name // get Item display name
							let nameRegex = /(.")(,)/
							let nameIndex = nameString.search(nameRegex)
							let playerName = entityData.name.contents
							let stringifiedPlayerName = ""
							stringifiedPlayerName = stringifiedPlayerName + playerName;
							let modifiedName = nameString.substring(0, (nameIndex + 1)) + ` ${stringifiedPlayerName} ` + nameString.substring((nameIndex + 1))
							let loreString = entityData.getInventory().getItem(slot).getTag().display.Lore // get Item lore
							let stringifiedLore = ""
							stringifiedLore = stringifiedLore + loreString;
							let loreRegex = /STATUS/
							let loreIndex = stringifiedLore.search(loreRegex)
							let newStatus = `Prematch - Registered to ${stringifiedPlayerName} as Player ${currentPlayersCount().length + 1}`
							let modifiedLore = stringifiedLore.substring(0, (loreIndex + 8)) + newStatus + stringifiedLore.substring((loreIndex + 26))
							event.server.tell(`Found a valid Card! You have been registered as Player ${currentPlayersCount().length + 1}.`); //not sure if this will whisper or tell the whole server
							entityData.getInventory().getItem(slot).getTag().display.Name = modifiedName;
							entityData.getInventory().getItem(slot).getTag().Inscribed = "Vulpine Co. [stage2-prematch]"; //Set the NBT tag to stage2
							entityData.getInventory().getItem(slot).getTag().display.Lore = eval(modifiedLore);
							pushCurrentPlayers(stringifiedPlayerName, (currentPlayersCount().length + 1));
							entityData.addTag('ga_registered_player')
							
							break;
						} else {continue};

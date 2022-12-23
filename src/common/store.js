

const storeCharacter = (character) => {

	chrome.storage.local.get({dnd_sync: {}})
		.then((result) => {
			const storage = result.dnd_sync
			storage.characters = storage.characters ?? {};
			storage.characters[character.type] = storage.characters[character.type] ?? {};
			storage.characters[character.type][character.url] = character.getDict()
			return chrome.storage.local.set({dnd_sync: storage})
		})
		.then(() => {
			chrome.storage.local.get({dnd_sync: {}})
			.then((result) => {
				console.log(result.dnd_sync);
			}) 
		})
}

const getCharacters = () => {
	chrome.storage.local.get({dnd_sync: {}})
		.then((result) => {
			return result.dnd_sync?.characters
		})
}
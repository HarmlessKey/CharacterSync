

const storeCharacter = (character) => {

	chrome.storage.local.get({dnd_sync: {}})
		.then((result) => {
			const storage = result.dnd_sync
			storage.characters = storage.characters ?? {};
			storage.characters[character.url] = character.getDict()
			return chrome.storage.local.set({dnd_sync: storage})
		})
		.then(() => {
			chrome.storage.local.get({dnd_sync: {}})
			.then((result) => {
				console.log(result.dnd_sync);
			}) 
		})
}

const getCharacters = async () => {
	const storage = await chrome.storage.local.get({dnd_sync: {}});
	return storage?.dnd_sync?.characters || {};
}


function storeCharacter(character) {

	chrome.storage.sync.get({dnd_sync: {}})
		.then((result) => {
			const storage = result.dnd_sync
			storage.characters = storage.characters ?? {};
			storage.characters[character.url] = character.getDict()
			return chrome.storage.sync.set({dnd_sync: storage})
		})
		.then(() => {
			chrome.storage.sync.get({dnd_sync: {}})
			.then((result) => {
				console.log("Current storage:", result.dnd_sync);
			}) 
		})
}

async function getCharacters() {
	const storage = await chrome.storage.sync.get({dnd_sync: {}});
	return storage?.dnd_sync?.characters || {};
}
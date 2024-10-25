async function getStorage() {
	return await chrome.storage.sync.get();
}

async function storeCharacter(character) {
	await chrome.storage.sync.set({ [character.url]: character });
	const storage = await getStorage();
	console.log("Current storage:", storage);
}

async function getCharacters() {
	const storage = await getStorage();
	const characters = Object.fromEntries(
		Object.entries(storage).filter(([key]) => key !== "config")
	);
	return characters || {};
}

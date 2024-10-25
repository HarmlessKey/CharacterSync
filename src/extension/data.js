export const getStorage = async () => {
	return await chrome.storage.sync.get();
};

export const getCharacters = async () => {
	console.log("GET CHARACTERS FUNCTIONS");
	const characters = Object.fromEntries(
		Object.entries(await getStorage()).filter(([key]) => key !== "config")
	);
	return characters || {};
};

export const removeCharacter = async (character_id) => {
	await chrome.storage.sync.remove(character_id);
};

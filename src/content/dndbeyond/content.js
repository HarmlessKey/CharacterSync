
/**
 * Initialize message listeners
 * Supported messages:
 * "sync" - syncCharacter
 */ 

chrome.runtime.onMessage.addListener((request, response, sendRequest) => {
	console.log('message received')
	if (request.sync) {
		syncCharacter();
	}
})

const syncCharacter = () => {
	character.updateCharacter();
	storeCharacter(character);
}

const documentChanged = async (mutations) => {
	// Only sync automatically if the character is in storage
	const characters = await getCharacters();
	if(characters?.[window.location.href]) {
		syncCharacter();
	}
}

const character = new DndBeyondCharacter();

const observer = new MutationObserver(documentChanged);

const target_nodes = document.querySelector('main').firstElementChild
observer.observe(target_nodes, { childList: true, subtree: true });

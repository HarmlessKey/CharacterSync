
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

const documentChanged = (mutations) => {
	syncCharacter();
}

const character = new DndBeyondCharacter();

const observer = new MutationObserver(documentChanged);

const target_nodes = document.querySelector('main').firstElementChild
observer.observe(target_nodes, { childList: true, subtree: true });

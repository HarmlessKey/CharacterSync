/**
 * Initialize message listeners
 * Supported messages:
 * "sync" - syncCharacter
 */

chrome.runtime.onMessage.addListener((request, response, sendRequest) => {
	console.log("Message received");
	if (request.sync) {
		syncCharacter();
	}
});

const syncCharacter = async () => {
	await character.updateCharacter();
	storeCharacter(character);
};

var timer;

const documentChanged = async (mutations) => {
	clearTimeout(timer);
	if (window.location.href !== URL) {
		observer.disconnect();
		console.log("Disconnected");
		return;
	}
	// Only sync automatically if the character is in storage
	const characters = await getCharacters();
	if (characters?.[window.location.href]) {
		timer = setTimeout(async () => await syncCharacter(), 2000);
	}
};

const URL = window.location.href;

const character = new DiceCloudCharacter();

const observer = new MutationObserver(documentChanged);
observer.observe(document, { childList: true, subtree: true });

const isDndBeyond = /^https?:\/\/(.*\.)?dndbeyond\.com\/characters\/\d+/;
const isShieldmaiden =
	/^https?:\/\/(.*\.)?shieldmaiden\.app\/content\/(players|characters)\/\-[a-zA-Z0-9-_]+/;
const isDiceCloud = /^https?:\/\/(.*\.)?dicecloud\.com\/character\/[A-z\d]+/;
const isLocalhost = /^https?:\/\/localhost.*/;

const getCurrentTab = async () => {
	const queryOptions = { active: true, lastFocusedWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);
	return tab;
};

const syncCharacter = async () => {
	console.log("Sync character");
	const tab = await getCurrentTab();
	chrome.tabs.sendMessage(tab.id, { sync: "send id with message in future" });
};

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.get({ config: {} }, (result) => {
		const config = result.config;
		config.active = true;
		chrome.storage.sync.set({ config }, () => {
			console.log("dnd sync is active");
		});
	});
});

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
	console.log(
		"Received message from:",
		sender.tab ? "from content script:" + sender.tab.url : "from extension"
	);
	if (req.function) {
		const func_name = req.function;
		if (func_name === "sync") {
			syncCharacter();
		}
	}
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log("updated tab");
	if (changeInfo.status === "complete") {
		if (isDndBeyond.test(tab.url)) {
			console.log("Is dnd beyond!");
			chrome.scripting.executeScript({
				target: { tabId: tabId },
				files: ["content/dndbeyond_character.js"],
			});
		}

		if (isDiceCloud.test(tab.url)) {
			console.log("Is Dice Cloud!");
			chrome.scripting.executeScript({
				target: { tabId: tabId },
				files: ["content/dicecloud_character.js"],
			});
		}

		if (isShieldmaiden.test(tab.url)) {
			console.log("Is Shieldmaiden (the best dnd app)!");
			chrome.scripting.executeScript({
				target: { tabId: tabId },
				files: ["content/shieldmaiden_character.js"],
			});
		}
	}
});

/* Receive messages from 3rd party sites
 * Listens to the requestContent
 */
chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {
	console.group(`Received request from:`, sender.url);

	const storage = await chrome.storage.sync.get({dnd_sync: {}});
	const content = {};

	// Content requests
	if (Array.isArray(request.request_content)) {
		console.group("Content request")
		if (request.request_content.includes("characters")) {
			console.log("Characters");
			content.characters = storage?.dnd_sync?.characters || {};
		}
		if (request.request_content.includes("version")) {
			console.log("Version");
			content.version = chrome.runtime.getManifest().version;
		}
		console.groupEnd();
	}
	console.log("Response", content);
	console.groupEnd();

	// Send response
	sendResponse(content);
})
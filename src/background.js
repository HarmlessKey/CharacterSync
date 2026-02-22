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

const getContentScriptFile = (url) => {
	if (isDndBeyond.test(url)) return "content/dndbeyond_character.js";
	if (isDiceCloud.test(url)) return "content/dicecloud_character.js";
	if (isShieldmaiden.test(url)) return "content/shieldmaiden_character.js";
	return null;
};

const syncCharacter = async () => {
	console.log("Sync character");
	const tab = await getCurrentTab();
	try {
		await chrome.tabs.sendMessage(tab.id, { sync: "send id with message in future" });
	} catch {
		// Content script not running yet (page was open before extension loaded) — inject and retry
		const file = getContentScriptFile(tab.url);
		if (file) {
			await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: [file] });
			chrome.tabs.sendMessage(tab.id, { sync: "send id with message in future" });
		}
	}
};

chrome.runtime.onInstalled.addListener(async () => {
	// Check if old characters in storage and convert them to new characters
	await chrome.storage.sync.get("dnd_sync", async (result) => {
		if (result?.dnd_sync?.characters) {
			console.log("Migrating old character sync storage to new storage");
			const oldCharacters = result.dnd_sync.characters;
			await chrome.storage.sync.remove("dnd_sync");
			await chrome.storage.sync.set({ ...oldCharacters });
		}
	});
	chrome.storage.sync.get({ config: {} }, async (result) => {
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

	// Firefox bridge: relayed external request from bridge.js content script on Shieldmaiden/HarmlessKey
	if (req.CS_BRIDGE) {
		const isAllowedSender =
			/^https?:\/\/(.*\.)?shieldmaiden\.app/.test(sender.tab?.url) ||
			/^https?:\/\/(.*\.)?harmlesskey\.com/.test(sender.tab?.url);
		if (isAllowedSender) {
			chrome.storage.sync.get().then((storage) => {
				const content = {};
				if (Array.isArray(req.request_content)) {
					if (req.request_content.includes("characters")) {
						content.characters = Object.fromEntries(
							Object.entries(storage).filter(([key]) => key !== "config")
						);
					}
					if (req.request_content.includes("version")) {
						content.version = chrome.runtime.getManifest().version;
					}
				}
				sendResponse(content);
			});
			return true; // keep port open for async sendResponse
		}
	}
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log("Updated tab");
	if (changeInfo.status === "complete") {
		const file = getContentScriptFile(tab.url);
		if (file) {
			console.log("Injecting content script:", file);
			chrome.scripting.executeScript({ target: { tabId }, files: [file] });
		}
	}
});

/* Receive messages from 3rd party sites
 * Listens to the requestContent
 */
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
	console.group(`Received request from:`, sender.url);

	chrome.storage.sync.get().then((storage) => {
		const content = {};

		// Content requests
		if (Array.isArray(request.request_content)) {
			console.group("Content request");
			if (request.request_content.includes("characters")) {
				const characters = Object.fromEntries(
					Object.entries(storage).filter(([key]) => key !== "config")
				);
				console.log("Characters");
				content.characters = characters || {};
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
	});

	return true; // keep port open for async sendResponse
});

const isDndBeyond = /^https?:\/\/(.*\.)?dndbeyond\.com\/characters\/\d+/;
const isHarmlessKey = /^https?:\/\/(.*\.)?harmlesskey\.com\/content\/(players|characters)\/\-[a-zA-Z0-9-_]+/;

const getCurrentTab = async () => {
	const queryOptions = { active: true, lastFocusedWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

const syncCharacter = async () => {
	console.log("Sync character")
	const tab = await getCurrentTab();
	chrome.tabs.sendMessage(tab.id, {sync:'send id with message in future'})
}

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.get({dnd_sync: {}}, (result) => {
		const storage = result.dnd_sync;
		storage.active = true;
		chrome.storage.local.set({dnd_sync: storage}, () => {
			console.log("dnd sync in active")
		})
	})
})

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
	console.log('Received message from:', sender.tab ? 'from content script:' + sender.tab.url : 'from extension')
	if (req.function) {
		const func_name = req.function
		if (func_name === 'sync') {
			syncCharacter();
		}
	}
})


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log('updated tab')
	if (changeInfo.status === 'complete') {
		if (isDndBeyond.test(tab.url)) {
			console.log("Is dnd beyond!")
			chrome.scripting.executeScript({
				target: { tabId: tabId },
				files: ["dist/dndbeyond_character.js"]
			})
		}

		if (isHarmlessKey.test(tab.url)) {
			console.log("Is Harmless Key (the best dnd app)!")
			chrome.scripting.executeScript({
				target: { tabId: tabId },
				files: ["dist/harmlesskey_character.js"]
			})
		}
	}
});

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.get({dnd_sync: {}}, (result) => {
		const storage = result.dnd_sync;
		storage.active = true;
		chrome.storage.local.set({dnd_sync: storage}, () => {
			console.log("dnd sync in active")
		})
	})
})

const isDndBeyond = /^https?:\/\/.*\.dndbeyond\.com\/character/;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		if (isDndBeyond.test(tab.url)) {
			console.log("Is dnd beyond!")
			chrome.scripting.executeScript({
				target: { tabId: tabId },
				files: ["src/dndbeyond/content.js"]
			})
		}
	}
});

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.get({dnd_sync: {}}, (result) => {
		const storage = result.dnd_sync;
		storage.active = true;
		chrome.storage.local.set({dnd_sync: storage}, () => {
			console.log("dnd sync in active")
		})
	})
})


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
		chrome.scripting.executeScript({
			target: { tabId: tabId },
			files: ["./content.js"]
		})
		.then(() => {
			console.log("INJECTED THE FOREGROUND SCRIPT.");
		})
		.catch(err => console.log(err));
	}
});
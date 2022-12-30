
const resetStorage = () => {
	chrome.storage.local.set({dnd_sync: {}})
}

const outputStorage = () => {
	chrome.storage.local.get({dnd_sync: {}}, (result) => {
		console.log(result.dnd_sync);
	})
}

const sendMessage = async () => {
	console.log('message sent')
	const response = await chrome.runtime.sendMessage({function: "sync"});
	console.log(response);
}

document.getElementById("sync_character").addEventListener('click', sendMessage);

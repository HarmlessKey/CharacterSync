

const storeUrlInStorage = async () => {
	console.log('in storeUrl')
	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		const url = tabs[0].url
		console.log('before Set')
		chrome.storage.local.get({dnd_sync: {}})
			.then((result) => {
				const storage = result.dnd_sync
				storage.urls = storage.urls ?? []
				storage.urls.push(url)
				return chrome.storage.local.set({dnd_sync: storage})
			})
			.then(() => {
				chrome.storage.local.get({dnd_sync: {}})
				.then((result) => {
					console.log(result.dnd_sync);
				}) 
			})
	})
	
}

const resetStorage = () => {
	chrome.storage.local.set({dnd_sync: {}})
}

const outputStorage = () => {
	chrome.storage.local.get({dnd_sync: {}}, (result) => {
		console.log(result.dnd_sync);
	})
}

document.getElementById("storeUrlInStorage").addEventListener("click", storeUrlInStorage);
document.getElementById("resetStorage").addEventListener("click", resetStorage);
document.getElementById("isActive").addEventListener('click', outputStorage);

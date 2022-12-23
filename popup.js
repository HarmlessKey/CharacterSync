
const resetStorage = () => {
	chrome.storage.local.set({dnd_sync: {}})
}

const outputStorage = () => {
	chrome.storage.local.get({dnd_sync: {}}, (result) => {
		console.log(result.dnd_sync);
	})
}


document.getElementById("resetStorage").addEventListener("click", resetStorage);
document.getElementById("isActive").addEventListener('click', outputStorage);

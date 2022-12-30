
const resetStorage = () => {
	chrome.storage.local.set({dnd_sync: {}})
}

const outputStorage = () => {
	chrome.storage.local.get({dnd_sync: {}}, (result) => {
		console.log(result.dnd_sync);
	})
}

const sendMessage = async (e) => {
	const icon = e.target.querySelector(".fa-sync-alt");
	console.log(icon)
	icon.classList.add("spin");
	await chrome.runtime.sendMessage({function: "sync"});
	setTimeout(() => {
		icon.classList.remove("spin")
	}, 1000);
}

const sync_buttons = document.querySelectorAll("button.sync-character");
for(const button of sync_buttons) {
	button.addEventListener('click', sendMessage);
}

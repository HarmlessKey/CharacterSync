import { syncCharacter, navigate, stepSelect, setTabs, tabSelect } from "./functions.js";
import { my_characters } from "./data.js";
let characters = my_characters;

// Watch for changes in characters
chrome.storage.onChanged.addListener((changes, _namespace) => {
	characters = changes?.dnd_sync?.newValue?.characters || {};
	setTabs(characters);
});

// Add my-characters tab if there are characters
setTabs(characters);

// Check if HK or DNDB
chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
	const current_page = tabs[0].url;
	const isDNDB = current_page.includes("dndbeyond.com");
	const isHK = current_page.includes("harmlesskey.com");
	
	// Create a sync button
	const sync_btn = document.createElement("button");
	sync_btn.setAttribute("class", "w-full mb-1 block sync-character");
	sync_btn.addEventListener("click", syncCharacter);
	sync_btn.innerHTML = '<i class="fas fa-sync-alt" aria-hidden="true"></i> Sync character';
	const my_characters_footer = document.querySelector("#my-characters .footer");

	if(isDNDB) {
		stepSelect();
		if(current_page.match(/\/(characters\/)+[0-9]+/)) {
			document.querySelector("#dndbeyond-sync").classList.add("is-active");

			if(characters && !Object.keys(characters).includes(current_page)) {
				my_characters_footer.prepend(sync_btn);
			}
		} else {
			document.querySelector("#dndbeyond").classList.add("is-active");
		}
	}
	if(isHK) {
		stepSelect();
		if(current_page.match(/\/(content\/)+((characters)|(players))+\/.+/)) {
			document.querySelector("#harmlesskey-sync").classList.add("is-active");

			if(characters && !Object.keys(characters).includes(current_page)) {
				my_characters_footer.prepend(sync_btn);
			}
		} else {
			document.querySelector("#harmlesskey").classList.add("is-active");		
		}
	}
});

// Tab buttons
const tabs = document.querySelectorAll("#tabs > button");
for (const tab of tabs) {
	tab.addEventListener("click", tabSelect);
}

// Navigate buttons
const page_buttons = document.getElementsByClassName('open-page');
for (const button of page_buttons) {
	button.addEventListener('click', navigate, false);
}

// Step buttons
const stepButtons = document.querySelectorAll("button.step-select");
for (const step of stepButtons) {
	step.addEventListener("click", stepSelect)
}

// Sync Character buttons
const sync_buttons = document.querySelectorAll("button.sync-character");
for(const button of sync_buttons) {
	button.addEventListener('click', syncCharacter);
}
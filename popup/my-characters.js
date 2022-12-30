const storage = await chrome.storage.local.get({dnd_sync: {}});
const characters = storage?.dnd_sync?.characters || {};

const character_list = document.getElementById("characters");

const getCurrentTab = async () => {
	const tabs = await chrome.tabs.query({currentWindow: true, active: true});
	return tabs[0].url;
}

const calcMod = (value) => {
	return value ? Math.floor((value - 10) / 2) : 0;
}

const collapse = (e) => {
	e.preventDefault();
	const id = e.currentTarget.parentNode.getAttribute("id");
	const is_active = e.currentTarget.parentNode.classList.value.includes("is-active");

	const all_items = document.querySelectorAll("ul#characters>li");
	for(const li of all_items) {
		li.classList.remove("is-active");
	}
	if(!is_active) {
		const open = document.getElementById(id);
		open.classList.add("is-active");
	}
}

// Delete character
const deleteCharacter = (e) => {
	const id = e.target.getAttribute("data-url");
	const li = document.getElementById(id);
	li.parentNode.removeChild(li);
	delete characters[id];
	storage.dnd_sync.characters = characters;
	chrome.storage.local.set(storage);
};

// Sync Character
const syncCharacter = async (e) => {
	const icon = e.target.querySelector(".fa-sync-alt");
	icon.classList.add("spin");
	await chrome.runtime.sendMessage({ function: "sync" });
	setTimeout(() => {
		icon.classList.remove("spin")
	}, 1000);
};

const renderCharacters = async (list) => {
	character_list.innerHTML = ""; // Clear the list first
	for(const character of list) {
		const li = document.createElement("li");
		li.setAttribute("id", character.url);
	
		const left = document.createElement("div");
		left.setAttribute("class", "character");
	
		const avatar = document.createElement("div");
		avatar.setAttribute("class", "avatar");
	
		if(character.avatar) {
			avatar.setAttribute("style", `background-image: url(${character.avatar});`)
		}
	
		const info = document.createElement("div");
		info.setAttribute("class", "info");
		const resource = document.createElement("div");
		const name = document.createElement("div");
		resource.setAttribute("class", "resource");
		name.setAttribute("class", "name truncate");
	
		resource.innerText = (character.source === "HarmlessKey") ? "Harmless Key" : "D&D Beyond";
		name.innerText = character.name;
	
		info.appendChild(resource);
		info.appendChild(name);
		left.appendChild(avatar)
		left.appendChild(info);
		left.addEventListener("click", collapse);
		li.appendChild(left);
		
		// Sheet
		const sheet = document.createElement("div");
		sheet.setAttribute("class", "sheet");

		const stats = document.createElement("div");
		stats.setAttribute("class", "stats");
		for(const value of ["max_hit_points", "armor_class", "walking_speed", "initiative"]) {
			const stat = document.createElement("div");
			stat.setAttribute("class", "stat");

			const names = {
				"max_hit_points": "Hit Points",
				"armor_class": "Armor Class",
				"walking_speed": "Speed",
				"initiative": "Initiative"
			};

			stat.innerHTML = `<div class="value">${(value === "initiative") ? `<span class="neutral-4">${character[value] >= 0 ? "+" : "-"}</span>${Math.abs(character[value])}` : character[value]}</div>`;
			stat.innerHTML += `<div class="name">${names[value]}</div>`;
			
			stats.appendChild(stat);
		}
		sheet.appendChild(stats);
		
		const abilities = document.createElement("div");
		abilities.setAttribute("class", "abilities");
		

		for(const ability of ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"]) {
			const score = document.createElement("div");
			score.setAttribute("class", "ability");
			score.innerHTML = `<div class="name">${ability.substring(0, 3)} <strong>${character[ability]}</strong></div>`;
			score.innerHTML += `<div class="modifier"><span class="neutral-4">${calcMod(character[ability]) >= 0 ? "+" : "-"}</span>${Math.abs(calcMod(character[ability]))}</div>`;
			
			abilities.appendChild(score);
		}
		sheet.appendChild(abilities);

	
		// Add action buttons
		const actions = document.createElement("div");
		actions.setAttribute("class", "actions");

		let action_btn;

		// Sync button if tab === character.url
		if(await getCurrentTab() === character.url) {
			action_btn = document.createElement("button");
			action_btn.setAttribute("class", "btn btn-clear");
			action_btn.innerHTML = '<i class="fas fa-sync-alt"></i>';
			action_btn.addEventListener("click", syncCharacter);
		}

		// Open button on other tab
		else {
			action_btn = document.createElement("a");
			action_btn.setAttribute("class", "btn btn-clear");
			action_btn.setAttribute("href", character.url);
			action_btn.setAttribute("target", "_blank");
			action_btn.setAttribute("rel", "noopener");
			action_btn.innerHTML = '<i class="fas fa-external-link-alt"></i>';
		}
	
		const delete_btn = document.createElement("button");
		delete_btn.setAttribute("class", "btn-clear delete-character");
		delete_btn.setAttribute("data-url", character.url);
		delete_btn.addEventListener("click", deleteCharacter);
		delete_btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
	
		actions.appendChild(action_btn);
		actions.appendChild(delete_btn);
	
		li.appendChild(actions);
		li.appendChild(sheet); // Append sheet after actions
		
		// Add the li to the list
		character_list.appendChild(li);
	}
};
renderCharacters(Object.values(characters));

// Watch for changes
chrome.storage.onChanged.addListener((changes, _namespace) => {
	const new_characters = changes?.dnd_sync?.newValue?.characters || {};
	character_list.innerHTML = "";
	renderCharacters(Object.values(new_characters));
});

const search_input = document.getElementById("search-input");
const searchReplace = (input) => {
	return input ? input.normalize('NFD').replace(/\p{Diacritic}/gu, "").replace(/ /g, "").toLowerCase() : input;
};
const search = (e) => {
	const input = e.target.value;
	const filtered = Object.values(characters).filter(char => searchReplace(char.name).includes(searchReplace(input)));
	renderCharacters(filtered);
};
search_input.addEventListener("keyup", search);
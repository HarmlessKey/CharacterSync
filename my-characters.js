const storage = await chrome.storage.local.get({dnd_sync: {}});
const characters = storage?.dnd_sync?.characters || {};

const character_list = document.getElementById("characters");

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
};

const renderCharacters = (list) => {
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
	
		resource.innerText = (character.source === "harmlesskey") ? "Harmless Key" : "D&D Beyond";
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
	
		const open_btn = document.createElement("a");
		const sync_btn = document.createElement("a");
		const delete_btn = document.createElement("button");
		sync_btn.setAttribute("class", "btn btn-clear");
		sync_btn.setAttribute("href", character.url);
		sync_btn.setAttribute("target", "_blank");
		sync_btn.setAttribute("rel", "noopener");
		open_btn.setAttribute("class", "btn btn-clear");
		open_btn.setAttribute("href", character.url);
		open_btn.setAttribute("target", "_blank");
		open_btn.setAttribute("rel", "noopener");
		delete_btn.setAttribute("class", "btn-clear delete-character");
		delete_btn.setAttribute("data-url", character.url);
		delete_btn.addEventListener("click", deleteCharacter);
		sync_btn.innerHTML = '<i class="fas fa-sync-alt"></i>';
		open_btn.innerHTML = '<i class="fas fa-external-link-alt"></i>';
		delete_btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
	
		actions.appendChild(open_btn);
		actions.appendChild(sync_btn);
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
const search = (e) => {
	const input = e.target.value;
	const filtered = Object.values(characters).filter(char => char.name.toLowerCase().includes(input.toLowerCase()));
	renderCharacters(filtered);
};
search_input.addEventListener("keyup", search);
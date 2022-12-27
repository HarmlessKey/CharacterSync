const characters = {
	"https://harmlesskey.com/content/characters/-MYLOFg376Mz5NOR2hT4": {
		name: "Jake",
		source: "harmlesskey",
		url: "https://harmlesskey.com/content/characters/-MYLOFg376Mz5NOR2hT4",
		avatar: "https://www.dndbeyond.com/avatars/17/415/636377885173419481.jpeg?width=150&height=150&fit=crop&quality=95&auto=webp",
		armor_class: 18,
		hit_points: 39,
		initiative: 5,
		level: 6,
		speed: 55,
		strength: 8,
		dexterity: 20,
		constitution: 13,
		intelligence: 12,
		wisdom: 16,
		charisma: 10
	},
	"https://www.dndbeyond.com/characters/38281958": {
		name: "Levi Wright and A Very Long Name After",
		source: "dndbeyond",
		url: "https://www.dndbeyond.com/characters/38281958",
		avatar: "https://www.dndbeyond.com/avatars/23587/772/1581111423-38281958.jpeg?width=150&height=150&fit=crop&quality=95&auto=webp",
		armor_class: 15,
		hit_points: 39,
		initiative: 4,
		level: 30,
		speed: 55,
		strength: 10,
		dexterity: 18,
		constitution: 12,
		intelligence: 13,
		wisdom: 16,
		charisma: 8
	},
};

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
		for(const value of ["hit_points", "armor_class", "speed", "initiative"]) {
			const stat = document.createElement("div");
			stat.setAttribute("class", "stat");

			const names = {
				"hit_points": "Hit Points",
				"armor_class": "Armor Class",
				"speed": "Speed",
				"initiative": "Initiative"
			};

			// stat.innerHTML = `<i class="fas ${stats_table[value].icon}" aria-hidden="true"></i>`;
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
			score.innerHTML += `<div class="modifier"><span class="neutral-4">${character[ability] >= 0 ? "+" : "-"}</span>${Math.abs(calcMod(character[ability]))}</div>`;
			// score.innerHTML += `<div class="score">${character[ability]}</div>`;
			
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

const search_input = document.getElementById("search-input");
const search = (e) => {
	const input = e.target.value;
	character_list.innerHTML = "";
	const filtered = Object.values(characters).filter(char => char.name.toLowerCase().includes(input.toLowerCase()));
	renderCharacters(filtered);
};
search_input.addEventListener("keyup", search);
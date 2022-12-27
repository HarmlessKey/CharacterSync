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
		name: "Levi Wright",
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
		li.appendChild(left);
	
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
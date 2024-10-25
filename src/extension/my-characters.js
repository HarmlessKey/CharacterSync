import { syncCharacter, calcMod, getCurrentTab } from "./functions.js";
import { my_characters, storage } from "./data.js";

let characters = my_characters || {};
const character_list = document.getElementById("characters");

// Open or collapse a character sheet
const collapse = (e) => {
	e.preventDefault();
	const id = e.currentTarget.parentNode.getAttribute("id");
	const is_active = e.currentTarget.parentNode.classList.value.includes("is-active");

	const all_items = document.querySelectorAll("ul#characters>li");
	for (const li of all_items) {
		li.classList.remove("is-active");
	}
	if (!is_active) {
		const open = document.getElementById(id);
		open.classList.add("is-active");
	}
};

// Delete character
const deleteCharacter = (e) => {
	const id = e.target.getAttribute("data-url");
	const li = document.getElementById(id);
	li.parentNode.removeChild(li);
	delete characters[id];
	chrome.storage.sync.remove(id);
};

// Render Character List Items
const renderCharacters = async (list) => {
	character_list.innerHTML = ""; // Clear the list first

	// Add and empty li when no characters are found
	if (!list.length) {
		const li = document.createElement("li");
		li.setAttribute("class", "no-characters");
		li.innerText = "No characters found";
		character_list.appendChild(li);
		return;
	}

	for (const character of list) {
		const li = document.createElement("li");
		li.setAttribute("id", character.url);

		const left = document.createElement("div");
		left.setAttribute("class", "character");

		const avatar = document.createElement("div");
		avatar.setAttribute("class", "avatar");

		const image = character.avatar
			? character.avatar
			: character.source === "HarmlessKey" || character.source === "Shieldmaiden"
			? "../assets/images/logo_shieldmaiden_icon.png"
			: "";
		avatar.setAttribute("style", `background-image: url(${image});`);
		if (image === "") {
			avatar.innerHTML = '<i class="far fa-helmet-battle default-avatar"></i>';
		}

		if (character.level) {
			const level = document.createElement("div");
			level.setAttribute("class", "level truncate");
			level.innerText = character.level;
			avatar.appendChild(level);
		}

		const info = document.createElement("div");
		info.setAttribute("class", "info");
		const resource = document.createElement("div");
		const name = document.createElement("div");
		resource.setAttribute("class", "resource");
		name.setAttribute("class", "name truncate");

		resource.innerText = getSourceName(character.source);
		name.innerText = character.name;

		info.prepend(resource);
		info.appendChild(name);
		left.appendChild(avatar);
		left.appendChild(info);
		left.addEventListener("click", collapse);
		li.appendChild(left);

		// Sheet
		const sheet = document.createElement("div");
		sheet.setAttribute("class", "sheet");

		const stats = document.createElement("div");
		stats.setAttribute("class", "stats");
		for (const value of ["max_hit_points", "armor_class", "walking_speed", "initiative"]) {
			const stat = document.createElement("div");
			stat.setAttribute("class", "stat");

			const names = {
				max_hit_points: "Hit Points",
				armor_class: "Armor Class",
				walking_speed: "Speed",
				initiative: "Initiative",
			};

			stat.innerHTML = `<div class="value">${
				value === "initiative"
					? `<span class="neutral-4">${character[value] >= 0 ? "+" : "-"}</span>${Math.abs(
							character[value]
					  )}`
					: character[value]
			}</div>`;
			stat.innerHTML += `<div class="name">${names[value]}</div>`;

			stats.appendChild(stat);
		}
		sheet.appendChild(stats);

		const abilities = document.createElement("div");
		abilities.setAttribute("class", "abilities");

		for (const ability of [
			"strength",
			"dexterity",
			"constitution",
			"intelligence",
			"wisdom",
			"charisma",
		]) {
			const score = document.createElement("div");
			score.setAttribute("class", "ability");
			score.innerHTML = `<div class="name">${ability.substring(0, 3)} <strong>${
				character[ability]
			}</strong></div>`;
			score.innerHTML += `<div class="modifier"><span class="neutral-4">${
				calcMod(character[ability]) >= 0 ? "+" : "-"
			}</span>${Math.abs(calcMod(character[ability]))}</div>`;

			abilities.appendChild(score);
		}
		sheet.appendChild(abilities);

		// Add action buttons
		const actions = document.createElement("div");
		actions.setAttribute("class", "actions");

		let action_btn;

		// Sync button if tab === character.url
		if ((await getCurrentTab()) === character.url) {
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

// Create characters
renderCharacters(Object.values(characters));

// Select a filter
const filter = (e) => {
	characters = my_characters;

	// Set all pills inactive
	const pills = document.querySelectorAll(".pills .pill");
	for (const pill of pills) {
		pill.classList.remove("is-active");
	}

	// Clear search field
	const search_input = document.getElementById("search-input");
	search_input.value = "";

	const target = e.currentTarget;
	target.classList.add("is-active"); // Set selected active
	const source = target.getAttribute("data-source");

	// Filter characters on source
	if (source !== "all") {
		characters = Object.values(characters)
			.filter((character) => character.source === source)
			.reduce((all, char) => ({ ...all, [char.url]: char }), {});
	}
	renderCharacters(Object.values(characters));
};

// Filter buttons
const pills = document.querySelectorAll(".pills .pill");
for (const pill of pills) {
	pill.addEventListener("click", filter);
}

// Watch for changes
chrome.storage.onChanged.addListener((changes, _namespace) => {
	characters = changes?.dnd_sync?.newValue?.characters || {};
	character_list.innerHTML = "";
	renderCharacters(Object.values(characters));
});

// Search
const search_input = document.getElementById("search-input");
const searchReplace = (input) => {
	return input
		? input
				.normalize("NFD")
				.replace(/\p{Diacritic}/gu, "")
				.replace(/ /g, "")
				.toLowerCase()
		: input;
};
const search = (e) => {
	const input = e.target.value;
	const filtered = Object.values(characters).filter((char) =>
		searchReplace(char.name).includes(searchReplace(input))
	);
	renderCharacters(filtered);
};
search_input.addEventListener("keyup", search);

// Get source name
function getSourceName(source) {
	switch (source) {
		case "HarmlessKey":
		case "Shieldmaiden":
			return "Shieldmaiden";
		case "DnDBeyond":
			return "D&D Beyond";
		case "DiceCloud":
			return "Dice Cloud";
		default:
			return "D&D Beyond";
	}
}

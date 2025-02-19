let quickRolls = {};

// POPUP
const input = document.getElementById("roll-string");
input.focus();
input.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		executeInput(e.target.value);
	}
	if (e.key === "ArrowUp") {
		getHistory(1);
	}
	if (e.key === "ArrowDown") {
		getHistory(-1);
	}
});

chrome.storage.session.get(["rolls"], (result) => {
	const rolls = result.rolls || [];

	for (const roll of rolls) {
		addRoll(roll);
	}
});

// Quick Rolls
const quick_btn = document.getElementById("quick-roll-button");
quick_btn.addEventListener("click", quickRoll);

const quick_rolls = document.getElementById("quick-rolls");
for (const d of [20, 4, 6, 8, 10, 100, 12]) {
	const die = document.createElement("button");
	die.setAttribute("class", `roll-button d${d}`);
	die.setAttribute("data-die", d);
	die.addEventListener("click", (e) => setQuickRoll(e, "+"));
	die.addEventListener("contextmenu", (e) => setQuickRoll(e, "-"));

	if (d === 100) {
		die.innerHTML =
			`<i class="fas fa-dice-d10" aria-hidden="true"></i>` +
			`<i class="fas fa-dice-d10" aria-hidden="true"></i>`;
	} else {
		die.innerHTML = `<i class="fas fa-dice-d${d}" aria-hidden="true"></i>`;
	}

	quick_rolls.appendChild(die);
}

//FUNCTIONS
export function quickRoll(e) {
	const rolls = [];
	for (const [die, count] of Object.entries(quickRolls)) {
		rolls.push(`${count}d${die}`);
	}
	executeInput(rolls.join("+"));
	quickRolls = {};
	e.currentTarget.classList.add("hidden");
	const dice = document.querySelectorAll("#quick-rolls button");
	for (const die of dice) {
		const counter = die.querySelector(".count");
		if (counter) die.removeChild(counter);
	}
}

export function setQuickRoll(e, operator) {
	const quick_btn = document.getElementById("quick-roll-button");
	const btn = e.currentTarget;
	const die = btn.getAttribute("data-die");
	const current = quickRolls[die] || 0;

	if (operator === "-") {
		e.preventDefault();
		quickRolls[die] = current > 0 ? current - 1 : 0;
	} else {
		quickRolls[die] = current < 9 ? current + 1 : 9;
	}

	const counter = btn.querySelector(".count");
	if (counter) {
		if (quickRolls[die] == 0) {
			btn.removeChild(counter);
		} else {
			counter.innerText = quickRolls[die];
		}
	} else if (quickRolls[die]) {
		const count = document.createElement("div");
		count.setAttribute("class", "count");
		count.innerText = quickRolls[die];
		btn.appendChild(count);
	}

	// Show the Roll button
	if (Object.values(quickRolls).some((val) => val > 0)) {
		quick_btn.classList.remove("hidden");
	} else {
		quick_btn.classList.add("hidden");
	}
}

/**
 * Store rolls
 */
export function storeRoll(roll, label) {
	const new_roll = {
		total: roll.total,
		averageTotal: roll.averageTotal,
		maxTotal: roll.maxTotal,
		minTotal: roll.minTotal,
		notation: roll.notation,
		output: roll.output,
		title: label ? `${label}: ${roll.notation}` : roll.notation,
		rolls: roll.rolls,
		total: roll.total,
	};

	// Store in Chrome
	chrome.storage.session.get(["rolls"], (result) => {
		const current = result.rolls || [];
		current.push(new_roll);
		chrome.storage.session.set({ rolls: current });
	});

	// Add to HTML list
	addRoll(new_roll);
}

export function addRoll(roll) {
	const list = document.getElementById("rolls");
	const li = document.createElement("li");
	li.setAttribute("class", "roll");

	const notation = document.createElement("div");
	notation.setAttribute("class", "roll__notation");
	notation.innerText = roll.title;

	const result = document.createElement("div");
	result.setAttribute("class", "roll__result");

	const output = document.createElement("div");
	output.setAttribute("class", "roll__result-output");
	output.innerHTML = roll.output.replace(/.+:(.*)=.+/g, "$1").trim();
	output.prepend(notation);

	const total = document.createElement("div");
	total.setAttribute("class", "roll__result-total");
	total.innerText = roll.total;

	result.appendChild(output);
	result.appendChild(total);

	// Actions
	const actions = document.createElement("div");
	actions.setAttribute("class", "roll__actions");
	const reroll = document.createElement("button");
	reroll.setAttribute("class", "actions__reroll");
	reroll.addEventListener("click", () => executeInput(roll.title));
	reroll.innerHTML = '<i class="fas fa-sync-alt" aria-hidden="true"></i>';
	const edit = document.createElement("button");
	edit.setAttribute("class", "actions__edit");
	edit.innerHTML = '<i class="fas fa-pencil" aria-hidden="true"></i>';
	const input = document.getElementById("roll-string");
	edit.addEventListener("click", () => {
		(input.value = roll.title), input.focus();
	});

	actions.appendChild(edit);
	actions.appendChild(reroll);

	li.appendChild(actions);
	li.appendChild(result);

	list.prepend(li);
}

export function executeInput(input) {
	const list = document.getElementById("rolls");
	try {
		if (input.match(/^\//g)) {
			runCommand(input);
		} else if (input.match(/^#/g)) {
			rollMacro(input);
		} else {
			for (const roll of input.split("|")) {
				let label;
				let notation = roll.trim();
				if (roll.match(/^.+:/g)) {
					label = roll.split(":")[0].trim();
					notation = roll.split(":")[1].trim();
				}
				const rolled = new rpgDiceRoller.DiceRoll(notation, label);
				storeRoll(rolled, label);
			}
		}
		document.getElementById("roll-string").value = "";
	} catch (e) {
		console.error(e);
		const feedback = document.createElement("li");
		feedback.setAttribute("class", "roll");
		feedback.innerHTML = `<div class="info error">${e}</div>`;
		list.prepend(feedback);
	} finally {
		saveHistory(input);
	}
}

function runCommand(command) {
	const list = document.getElementById("rolls");
	if (command === "/clear") {
		chrome.storage.session.set({ rolls: [] }, () => {
			list.innerHTML = "";
		});
	}
	if (command === "/help") {
		const info = document.createElement("li");
		info.setAttribute("class", "roll");

		info.innerHTML =
			'<div class="info"><p><b>Commands</b><br/>' +
			'<span class="command" data-command="/clear">/clear</span> Clear roll history<br/>' +
			'<span class="command" data-command="/m adv==Advantage:2d20kh1">/m [macro name]==[macro]</span> Create a new macro<br/>' +
			'<span class="command" data-command="/ml">/ml</span> List all your macros<br/>' +
			'<span class="command" data-command="/md">/md [macro name]</span> Delete a macro</p>' +
			"<p><b>Macros</b><br/>" +
			"Macros can be used to save notations and quickly execute them.<br/>" +
			'<span class="command" data-command="#">#[macro name]</span> Roll your macro</p>' +
			"<p><b>Dice</b><br/>" +
			"You can perform any basic dice roll.<br/>" +
			'<span class="command" data-command="2d4">2d4</span><br/><br/>' +
			"You can add different dice rolls together.<br/>" +
			'<span class="command" data-command="4d8+2d6">4d8+2d6</span><br/><br/>' +
			"You can add or subtract any value from the roll.<br/>" +
			'<span class="command" data-command="2d10+5">2d10+5</span> or <span class="command" data-command="1d20-1">1d20-1</span></p>' +
			"You can roll separate rolls at once, by dividing them with a |<br/>" +
			'<span class="command" data-command="To hit:1d20+2|Damage:4d6+4">1d20+2|4d6+4</span></p>' +
			"<p><b>Labels</b><br/>" +
			"You can label your rolls with a title.<br/>" +
			'<span class="command" data-command="Advantage:2d20kh1">Advantage:2d20kh1</span></p>' +
			'<a href="https://dice-roller.github.io/documentation/guide/#features" target="_blank" rel="noopener">Check here for advanced roll options</a>' +
			"</div>";
		list.prepend(info);
	}
	if (command.match(/^\/m/g)) {
		// Fetch macros
		chrome.storage.session.get(["macros"], (result) => {
			const current = result.macros || {};

			if (command.match(/^\/ml/g)) {
				const li = document.createElement("li");
				li.setAttribute("class", "roll");
				const macros = document.createElement("div");
				macros.setAttribute("class", "info");
				macros.innerHTML = "<div>Your macros</div>";

				for (const [key, value] of Object.entries(current)) {
					macros.innerHTML += `<span class="command" data-command="#${key}">#${key}</span> <span class="neutral-3">${value}</span><br/>`;
				}
				li.appendChild(macros);
				list.prepend(li);
				createCommandEvents();
			} else if (command.match(/^\/md/g)) {
				deleteMacro(command);
			} else {
				let macro = command.replace(/^\/m /g, "");
				macro = macro.split("==");
				const key = macro[0].trim();
				const value = macro[1].trim();
				current[key] = value;
				chrome.storage.session.set({ macros: current }, () => {
					const feedback = document.createElement("li");
					feedback.setAttribute("class", "roll");
					feedback.innerHTML =
						'<div class="info"><span class="success">Macro created</span><br/>' +
						`<span class="command" data-command="#${key}">${key}</span> ${value}` +
						"</div>";
					list.prepend(feedback);
					createCommandEvents();
				});
			}
		});
	}
	createCommandEvents();
}

function rollMacro(macro) {
	macro = macro.replace(/^#/g, "");
	chrome.storage.session.get(["macros"], (result) => {
		if (result?.macros?.[macro]) {
			executeInput(result.macros[macro]);
		}
	});
}

function deleteMacro(macro) {
	const list = document.getElementById("rolls");
	macro = macro.replace(/^\/md /g, "");
	chrome.storage.session.get(["macros"], (result) => {
		const current = result?.macros;
		delete current[macro];
		chrome.storage.session.set({ macros: current }, () => {
			const feedback = document.createElement("li");
			feedback.setAttribute("class", "roll");
			feedback.innerHTML = `<div class="info error">Macro ${macro} deleted<br/></div>`;
			list.prepend(feedback);
		});
	});
}

function createCommandEvents() {
	const input = document.getElementById("roll-string");
	const commands = document.querySelectorAll(".command");
	for (const cmd of commands) {
		cmd.addEventListener("click", (e) => {
			(input.value = e.target.getAttribute("data-command")), input.focus();
		});
	}
}

function saveHistory(input) {
	const max = 20;
	chrome.storage.session.get(["history"], (result) => {
		const current = result.history || [];
		current.unshift(input);
		if (current.length > max) {
			current.pop();
		}
		chrome.storage.session.set({ history: current });
	});
}

let index = -1;
export function getHistory(diff) {
	const input = document.getElementById("roll-string");
	index += diff;
	chrome.storage.session.get(["history"], (result) => {
		const current = result.history || [];
		if (index < -1) {
			index = current.length - 1;
		}
		if (index > current.length - 1) {
			index = -1;
		}
		if (index == -1) {
			input.value = "";
		} else {
			const value = current[index];
			input.value = value;
		}
	});
}

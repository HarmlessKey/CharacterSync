/**
 * Sends a message to 'content' with the request to execute the a function
 * @param {string} func
 */
export const sendMessage = async (func) => {
	await chrome.runtime.sendMessage({function: func});
};

/**
 * Syncs a character using the sendMessage function
 * @param {object} e
 */
export const syncCharacter = async (e) => {
	const icon = e.target.querySelector(".fa-sync-alt");
	icon.classList.add("spin");
	await sendMessage("sync");
	setTimeout(() => {
		icon.classList.remove("spin");
	}, 1000);

	// Remove the sync button from my-characters overview
	const footer = document.querySelector("#my-characters .footer");
	const btn = footer.querySelector(".sync-character")
	footer.removeChild(btn);
};

/**
 * Get the url for the current tab that's active
 * @returns {string} url
 */
export const getCurrentTab = async () => {
	const tabs = await chrome.tabs.query({currentWindow: true, active: true});
	return tabs[0].url;
}

/**
 * Calculate the modifier for an ability score
 * @param {number} value 
 * @returns {number}
 */
export const calcMod = (value) => {
	return value ? Math.floor((value - 10) / 2) : 0;
}

/**
 * Navigates to a url on the active tab
 * @param {object} event 
 */
export const navigate = (event) => {
	const element = event.target;
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			const tab = tabs[0];
			chrome.tabs.update(tab.id, {url: element.getAttribute("href")});
	});
};

/**
 * Adds the my-characters tab if there are characters
 * @param {object} characters
 */
export const setTabs = (characters) => {
	// If there are characters, add the my-characters tab and select it
	// Otherwise set the sync tab to active
	if(characters && Object.keys(characters).length) {
		const tab_container = document.getElementById("tabs");

		let tab = tab_container.querySelector("#my-characters-tab");
		if(!tab) {
			tab = document.createElement("div");
			tab.setAttribute("class", "tab");
			tab.setAttribute("id", "my-characters-tab");
			tab.setAttribute("data-pane", "#my-characters");
			tab.addEventListener("click", tabSelect);
			const btn = document.createElement("button");
			btn.setAttribute("class", "btn-sm btn-clear");
			btn.innerHTML = '<i class="fas fa-users" aria-hidden="true"></i> My Characters';
			tab.appendChild(btn);
			tab_container.prepend(tab);
		}
		tab.click();
	} else {
		const tab = document.getElementById("sync-tab");
		tab.classList.add("is-active");
		tab.click();
		document.getElementById("sync").classList.add("is-active");
	}
}

/**
 * Select a tab
 * @param {object} e 
 */
export const tabSelect = (e) => {
	const tabs = document.querySelectorAll("#tabs .tab");
	for (const tab of tabs) {
		tab.classList.remove("is-active");
	}
	const clickedTab = e.currentTarget;
	clickedTab.classList.add("is-active");
	e.preventDefault();
	const panes = document.querySelectorAll(".tab-pane");
	for (const pane of panes) {
		pane.classList.remove("is-active");
	}
	const activePaneId = clickedTab.getAttribute("data-pane");
	const activePane = document.querySelector(activePaneId);
	activePane.classList.add("is-active");
}

/**
 * Select a step
 * @param {object} e 
 */
export const stepSelect = (e) => {
	const steps = document.querySelectorAll(".step");
	for (const step of steps) {
		step.classList.remove("is-active");
	}
	if(e){
		const anchorReference = e.target;
		const activeStepId = anchorReference.getAttribute("data-step");
		const activeStep = document.querySelector(activeStepId);
		activeStep.classList.add("is-active");
	}
};
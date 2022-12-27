// Check if HK or DNDB
chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
	const current_page = tabs[0].url;
	const isDNDB = current_page.includes("dndbeyond.com");
	const isHK = current_page.includes("harmlesskey.com");

	if(isDNDB) {
		stepSelect();
		if(current_page.match(/\/(characters\/)+[0-9]+/)) {
			document.querySelector("#dndbeyond-sync").classList.add("is-active");
		} else {
			document.querySelector("#dndbeyond").classList.add("is-active");
		}
	}
	if(isHK) {
		stepSelect();
		if(current_page.match(/\/(content\/)+((characters)|(players))+\/.+/)) {
			document.querySelector("#harmlesskey-sync").classList.add("is-active");
		} else {
			document.querySelector("#harmlesskey").classList.add("is-active");		
		}
	}
});

// Navigate to url
const page_buttons = document.getElementsByClassName('open-page');
const navigate = (event) => {
	const element = event.target;
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			const tab = tabs[0];
			chrome.tabs.update(tab.id, {url: element.getAttribute("href")});
	});
};
for (const button of page_buttons) {
	button.addEventListener('click', navigate, false);
}

// Steps
const stepButtons = document.querySelectorAll("button.step-select");
const stepSelect = (e) => {
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
}
for (const step of stepButtons) {
	step.addEventListener("click", stepSelect)
}

// Tabs
const tabs = document.querySelectorAll("#tabs > button");
const tabClicks = (e) => {
	for (const tab of tabs) {
		tab.classList.remove("is-active");
	}
	const clickedTab = e.currentTarget;
	clickedTab.classList.add("is-active");
	e.preventDefault();
	const myContentPanes = document.querySelectorAll(".tab-pane");
	for (const pane of myContentPanes) {
		pane.classList.remove("is-active");
	}
	const anchorReference = e.target;
	const activePaneId = anchorReference.getAttribute("data-pane");
	const activePane = document.querySelector(activePaneId);
	activePane.classList.add("is-active");
}
for (const tab of tabs) {
	tab.addEventListener("click", tabClicks)
}
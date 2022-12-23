const documentChanged = (mutations) => {
	character.updateCharacter();
	storeCharacter(character);
}

const character = new DndBeyondCharacter();

const observer = new MutationObserver(documentChanged);

const target_nodes = document.querySelector('main').firstElementChild
observer.observe(target_nodes, { childList: true, subtree: true });

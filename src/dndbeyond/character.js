class DndBeyondCharacter extends Character {
	constructor() {
		super("DndBeyond");
	}

	updateCharacter() {
		if (this.name === null) {
			const parsedName = document.querySelector('.ddbc-character-tidbits__heading h1').textContent();
			this.name = parsedName ?? null;
		}

		console.log(this);
	}
}
class HkCharacter extends Character {
	constructor() {
		super("HarmlessKey");
	}

	updateCharacter() {
		if(!this.source) {
			this.source = "HarmlessKey";
		}
		this.url = window.location.href;

		this.setName(this.parseName());

		this.setAvatar(this.parseAvatar());

		this.level = 1;

		this.setArmorClass(this.parseArmorClass());

		this.setMaxHitPoints(this.parseMaxHitPoints())

		this.setWalkingSpeed(this.parseWalkingSpeed());

		this.setInitiative(this.parseInitiative());

		["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].forEach((ability) => {
			this.setAbilityScore(ability, this.parseAbilityScore(ability));
		});

		console.log("updated character to:", this);
	}

	parseName() {
		const parsedName = document.querySelector('[aria-label="Character name *"]')?.value
		return parsedName ?? null;
	}


	parseAvatar() {
		const avatar_url = "https://thispersondoesnotexist.com/image";
		return avatar_url ?? null;
	}

	parseArmorClass() {
		const armor_class = document.querySelector('[aria-label="Armor class *"]')?.value;
		return parseInt(armor_class) ?? null;
	}

	parseMaxHitPoints() {

		const max_hit_points = document.querySelector('[aria-label="Hit points *"]')?.value
		return max_hit_points;

	}

	parseWalkingSpeed() {
		return null;
	}

	parseInitiative() {
		return null;
	}

	parseAbilityScore(stat) {
		const abilityScore = document.querySelector(`[aria-label="${capitalizeFirst(stat)}"]`)?.value;
		return parseInt(abilityScore) ?? null;
	}
}
class DiceCloudCharacter extends Character {
	constructor() {
		super("DiceCloud");
	}

	updateCharacter() {
		if(!this.source) {
			this.source = "DiceCloud";
		}
		this.url = window.location.href;

		this.setName(this.parseName());

		this.setAvatar(this.parseAvatar());

		// this.setLevel(this.parseLevel());

		this.setArmorClass(this.parseStat("Armor Class"));

		this.setMaxHitPoints(this.parseMaxHitPoints())

		this.setWalkingSpeed(this.parseStat("Speed"));

		this.setInitiative(this.parseCheck("Initiative"));

		["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].forEach((ability, i) => {
			this.setAbilityScore(ability, this.parseAbilityScore(i));
		});

		console.log("updated character to:", this);
	}

	parseName() {
		const parsedName = document.querySelector('.v-toolbar__title')?.textContent
		return parsedName.trim() ?? null;
	}


	parseAvatar() {
		const avatar_url = document.querySelector('.v-avatar img')?.src;
		return avatar_url ?? null;
	}

	// parseLevel() {}

	parseStat(stat) {
		const containers = document.querySelectorAll('.stat');
		
		let parsedStat;
		for(const container of containers) {
			const name = container.querySelector('.v-card .layout .name')?.textContent;
			if(name.trim() === stat) {
				parsedStat = container.querySelector('.v-card .layout .value')?.textContent;
			}
		}
		return parseInt(parsedStat) ?? null;
	}

	parseCheck(check) {
		const containers = document.querySelectorAll('.check');
		
		let parsedStat;
		for(const container of containers) {
			const name = container.querySelector('.v-card .layout .name')?.textContent;
			if(name.trim() === check) {
				parsedStat = container.querySelector('.v-card .layout div .v-btn .v-btn__content .value')?.textContent;
			}
		}
		return parseInt(parsedStat) ?? null;
	}

	parseMaxHitPoints() {
		const Hp = document.querySelector('.health-bar .bar .value')?.textContent;
		const parsedHp = Hp ? parseInt(Hp.split("/")[1]) : null;
		return parsedHp ?? null;
	}

	parseAbilityScore(n) {
		const container = document.querySelectorAll('.ability-scores .v-list .ability-list-tile')[n];
		const parsedScore = container.querySelector('.v-list-item__action div .v-btn .v-btn__content div .value span')?.textContent;
		return parseInt(parsedScore) ?? 0;
	}
}
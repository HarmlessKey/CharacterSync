class DiceCloudCharacter extends Character {
	constructor() {
		super("DiceCloud");
	}

	async updateCharacter() {
		if(!this.source) {
			this.source = "DiceCloud";
		}
		this.url = window.location.href;

		this.isV1 = false;
		if (/v1\.dicecloud\.com/.test(this.url)) {
			this.isV1 = true;
		}

		this.setName(this.parseName());

		this.setAvatar(this.parseAvatar());

		this.setLevel(await this.parseLevel());

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
		let parsedName = null;
		if (this.isV1) {
			parsedName = document.querySelector('.character-name')?.textContent;
		}
		else {
			parsedName = document.querySelector('.v-toolbar__title')?.textContent
		}
		return parsedName?.trim() ?? null;
	}


	parseAvatar() {
		if (this.isV1) {
			return null;
		}
		const avatar_url = document.querySelector('.v-avatar img')?.src;
		return avatar_url ?? null;
	}

	async parseLevel() {
		if (this.isV1) {
			const level_v1 = document.querySelector('[name="journal"] .containerName')?.textContent.trim();
			const level = parseInt(level_v1.replace(/\D*/, ""))
			return level ?? null;
			
		}
		const container = document.querySelector('.class-details .v-card__title')
		if (!container) {
			document.querySelectorAll('.v-tab')[6].click()
			await new Promise(resolve => setTimeout(resolve, 10))
			document.querySelectorAll('.v-tab')[0].click()
		}
		
		const level_str = document.querySelector('.class-details .v-card__title').textContent.trim()
		const level = parseInt(level_str.replace(/\D*/, ""));
		return level ?? null;
	}

	parseStat(stat) {
		let container_selector = '.stat'
		let stat_name_selector = '.v-card .layout .name'
		let stat_value_selector = '.v-card .layout .value'
		if (this.isV1) {
			container_selector = '.stat-card'
			stat_name_selector = '.paper-font-subhead'
			stat_value_selector = '.numbers'
		}
		let containers = document.querySelectorAll(container_selector);
		
		let parsedStat;
		for(const container of containers) {
			const name = container?.querySelector(stat_name_selector)?.textContent;
			if(name.trim() === stat) {
				parsedStat = container?.querySelector(stat_value_selector)?.textContent;
				return parseInt(parsedStat) ?? null;
			}
		}
		return null;
	}

	parseCheck(check) {
		let container_selector = '.check'
		let stat_name_selector = '.v-card .layout .name'
		let stat_value_selector = '.v-card .layout div .v-btn .v-btn__content .value'
		if (this.isV1) {
			container_selector = '.stat-card'
			stat_name_selector = '.paper-font-subhead'
			stat_value_selector = '.numbers div'
		}

		const containers = document.querySelectorAll(container_selector);
		
		let parsedStat;
		for(const container of containers) {
			const name = container?.querySelector(stat_name_selector)?.textContent;
			if(name.trim() === check) {
				parsedStat = container?.querySelector(stat_value_selector)?.textContent;
				return parseInt(parsedStat) ?? null;
			}
		}
		return null;
	}

	parseMaxHitPoints() {
		if (this.isV1) {
			const hpField = document.querySelector('#hitPointSlider #input-1')
			const Hp = hpField.getAttribute('max')
			return parseInt(Hp) ?? null;
		}
		const Hp = document.querySelector('.health-bar .bar .value')?.textContent;
		const parsedHp = Hp ? parseInt(Hp.split("/")[1]) : null;
		return parsedHp ?? null;
	}

	parseAbilityScore(n) {
		let container_selector = '.ability-scores .v-list .ability-list-tile'
		let stat_selector = '.v-list-item__action div .v-btn .v-btn__content div .value span'
		if (this.isV1) {
			container_selector = '.stats .ability-mini-card'
			stat_selector = '.numbers .stat'
		}
		const container = document.querySelectorAll(container_selector)[n];
		const parsedScore = container?.querySelector(stat_selector)?.textContent;
		return parseInt(parsedScore) ?? 0;
	}
}
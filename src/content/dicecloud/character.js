class DiceCloudCharacter extends Character {
	constructor() {
		super("DiceCloud");
	}

	async updateCharacter() {
		if (!this.source) {
			this.source = "DiceCloud";
		}
		this.url = window.location.href;

		this.isV1 = false;
		if (/v1\.dicecloud\.com/.test(this.url)) {
			this.isV1 = true;
		}

		this.setName(this.parseName());

		this.setAvatar(await this.parseAvatar());

		this.setLevel(await this.parseLevel());

		this.setArmorClass(this.parseStat("Armor Class"));

		this.setMaxHitPoints(this.parseMaxHitPoints());

		this.setWalkingSpeed(this.parseStat("Speed"));

		this.setInitiative(this.parseCheck("Initiative"));

		["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].forEach(
			(ability, i) => {
				this.setAbilityScore(ability, this.parseAbilityScore(i));
			}
		);

		[
			"acrobatics",
			"animal_handling",
			"arcana",
			"athletics",
			"deception",
			"history",
			"insight",
			"intimidation",
			"investigation",
			"medicine",
			"nature",
			"perception",
			"performance",
			"persuasion",
			"religion",
			"sleight_of_hand",
			"stealth",
			"survival",
		].forEach((skill, i) => {
			this.setSkill(skill, this.parseSkill(i));
		});

		console.log("updated character to:", this);
	}

	parseName() {
		let parsedName = null;
		if (this.isV1) {
			parsedName = document.querySelector(".character-name")?.textContent;
		} else {
			parsedName = document.querySelector(".v-toolbar__title")?.textContent;
		}
		return parsedName?.trim() ?? null;
	}

	async parseAvatar() {
		if (this.isV1) {
			return null;
		}
		const container = document.querySelector(".build-tab .v-card .v-image .v-image__image");
		if (!container) {
			document.querySelectorAll(".v-tab")[5].click();
			await new Promise((resolve) => setTimeout(resolve, 10));
			document.querySelectorAll(".v-tab")[0].click();
		}
		const avatar_url = container?.style.backgroundImage;
		return avatar_url ? avatar_url.match(/url\("(.+)"\)/)[1] : null;
	}

	async parseLevel() {
		if (this.isV1) {
			const level_v1 = document
				.querySelector('[name="journal"] .containerName')
				?.textContent.trim();
			const level = parseInt(level_v1.replace(/\D*/, ""));
			return level ?? null;
		}
		const container = document.querySelector(".class-details .v-card__title");
		if (!container) {
			document.querySelectorAll(".v-tab")[6].click();
			await new Promise((resolve) => setTimeout(resolve, 10));
			document.querySelectorAll(".v-tab")[0].click();
		}

		const level_str = document.querySelector(".class-details .v-card__title")?.textContent?.trim();
		const level = parseInt(level_str?.replace(/\D*/, ""));
		return level ?? null;
	}

	parseStat(stat) {
		let container_selector = ".stat";
		let stat_name_selector = ".v-card .layout .name";
		let stat_value_selector = ".v-card .layout .value";
		if (this.isV1) {
			container_selector = ".stat-card";
			stat_name_selector = ".paper-font-subhead";
			stat_value_selector = ".numbers";
		}
		let containers = document.querySelectorAll(container_selector);

		let parsedStat;
		for (const container of containers) {
			const name = container?.querySelector(stat_name_selector)?.textContent;
			if (name.trim() === stat) {
				parsedStat = container?.querySelector(stat_value_selector)?.textContent;
				return parseInt(parsedStat) ?? null;
			}
		}
		return null;
	}

	parseCheck(check) {
		let container_selector = ".check";
		let stat_name_selector = ".v-card .layout .name";
		let stat_value_selector = ".v-card .layout div .v-btn .v-btn__content .value";
		if (this.isV1) {
			container_selector = ".stat-card";
			stat_name_selector = ".paper-font-subhead";
			stat_value_selector = ".numbers div";
		}

		const containers = document.querySelectorAll(container_selector);

		let parsedStat;
		for (const container of containers) {
			const name = container?.querySelector(stat_name_selector)?.textContent;
			if (name.trim() === check) {
				parsedStat = container?.querySelector(stat_value_selector)?.textContent;
				return parseInt(parsedStat) ?? null;
			}
		}
		return null;
	}

	parseMaxHitPoints() {
		if (this.isV1) {
			const hpField = document.querySelector("#hitPointSlider #input-1");
			const Hp = hpField.getAttribute("max");
			return parseInt(Hp) ?? null;
		}
		const Hp = document.querySelector(".health-bar .bar .value")?.textContent;
		const parsedHp = Hp ? parseInt(Hp.split("/")[1]) : null;
		return parsedHp ?? null;
	}

	parseAbilityScore(n) {
		let container_selector = ".ability-scores .v-list .ability-list-tile";
		let stat_selector = ".v-list-item__action div .v-btn .v-btn__content div .value span";
		if (this.isV1) {
			container_selector = ".stats .ability-mini-card";
			stat_selector = ".numbers .stat";
		}
		const container = document.querySelectorAll(container_selector)[n];
		let parsedScore = container?.querySelector(stat_selector)?.textContent;

		// When "Swap ability scores and modifiers" is turned on, the container for the score will be different
		if (parsedScore === undefined || parsedScore.match(/^[+-]/g)) {
			stat_selector = ".v-list-item__action div .v-btn .v-btn__content div .mod span";
			parsedScore = container?.querySelector(stat_selector)?.textContent;
		}

		return parseInt(parsedScore) ?? 0;
	}

	parseSkill(n) {
		const container = ".skills .v-card .v-list .v-list-item";
		const parsedSkill = document
			.querySelectorAll(container)
			[n]?.querySelector(".prof-mod")?.textContent;
		const parsedSkillValue = parsedSkill ? parseInt(parsedSkill) : undefined;

		const parsedSkillProficiencyIcon = document
			.querySelectorAll(container)
			[n]?.querySelector(".v-icon");
		const parsedSkillProficiency = this.parseSkillProficiency(parsedSkillProficiencyIcon);

		return { value: parsedSkillValue, proficiency: parsedSkillProficiency };
	}

	parseSkillProficiency(icon) {
		switch (true) {
			case icon?.classList.contains("mdi-radiobox-blank"):
				return 0;
			case icon?.classList.contains("mdi-brightness-1"):
				return 1;
			case icon?.classList.contains("mdi-album"):
				return 2;
			case icon?.classList.contains("mdi-brightness-3"):
				return 0.5;
			default:
				0;
		}
	}
}

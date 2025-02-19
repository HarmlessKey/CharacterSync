class DndBeyondCharacter extends Character {
	constructor() {
		super("DndBeyond");
	}

	updateCharacter() {
		if (!this.source) {
			this.source = "DndBeyond";
		}
		this.url = window.location.href;

		this.setName(this.parseName());

		this.setAvatar(this.parseAvatar());

		this.setLevel(this.parseLevel());

		this.setXp(this.parseXp());

		this.setArmorClass(this.parseArmorClass());

		this.setMaxHitPoints(this.parseMaxHitPoints());

		this.setWalkingSpeed(this.parseWalkingSpeed());

		this.setInitiative(this.parseInitiative());

		["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].forEach(
			(ability, i) => {
				this.setAbilityScore(ability, this.parseAbilityScore(i));
			}
		);

		["passive_perception", "passive_investigation", "passive_insight"].forEach((sense, i) => {
			this.setSense(sense, this.parseSense(i));
		});

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
	}

	parseName() {
		const parsedName = document.querySelector(".ddbc-character-tidbits__heading h1")?.textContent;
		return parsedName ?? undefined;
	}

	parseAvatar() {
		const avatar_src = document.querySelector(".ddbc-character-avatar__portrait")?.src;
		// regex to match url before query params
		const url_regex = /^[^?]+/;
		const avatar_match = avatar_src?.match(url_regex);

		return avatar_match
			? avatar_match[0]
			: "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png";
	}

	parseLevel() {
		let level = document.querySelector(".ddbc-character-progression-summary__level")?.textContent;
		if (!level) {
			// Non Milestone leveling
			const xp_container = document.querySelector(".ddbc-character-progression-summary__xp-bar");
			level = xp_container?.querySelector(
				".ddbc-xp-bar__item--cur .ddbc-xp-bar__label"
			)?.textContent;
		}

		const parsedLevel = level?.match(/\d+/).join();
		return parsedLevel ? parseInt(parsedLevel) : undefined;
	}

	parseXp() {
		const xp_container = document.querySelector(".ddbc-character-progression-summary__xp-bar");
		if (!xp_container) {
			return null;
		}
		const xp_data = xp_container
			.querySelector(".ddbc-character-progression-summary__xp-data")
			?.textContent?.split("/");
		return xp_data ? parseInt(xp_data[0].trim()) : undefined;
	}

	parseArmorClass() {
		if (isMobile()) {
			const armor_class = document.querySelector(
				".ct-combat-mobile__extra--ac .ct-combat-mobile__extra-value"
			)?.textContent;
			return armor_class ? parseInt(armor_class) : undefined;
		}
		const armor_class = document.querySelector(
			".ddbc-armor-class-box .ddbc-armor-class-box__value"
		)?.textContent;
		return armor_class ? parseInt(armor_class) : undefined;
	}

	parseMaxHitPoints() {
		// Open health-manager panel by clicking on health data
		const max_hp_selector = isDesktop()
			? "[data-testid=max-hp]"
			: ".ct-status-summary-mobile__hp-max";
		const max_hit_points = document.querySelector(max_hp_selector)?.textContent;
		return max_hit_points ? parseInt(max_hit_points) : undefined;
	}

	parseWalkingSpeed() {
		const container = isMobile()
			? "section[class^=styles_boxMobile]"
			: isTablet()
			? ".ct-combat-tablet__extra--speed"
			: ".ct-quick-info__box--speed";
		const parsedWalkingSpeed = document.querySelector(
			`${container} [class^=styles_numberDisplay]`
		)?.textContent;
		return parsedWalkingSpeed ? parseInt(parsedWalkingSpeed) : undefined;
	}

	parseInitiative() {
		const container = isMobile()
			? ".ct-combat-mobile__extra--initiative"
			: isTablet()
			? ".ct-combat-tablet__extra--initiative"
			: ".ct-combat__summary-group--initiative";
		const parsedInitiative = document.querySelector(
			`${container} [class^=styles_numberDisplay]`
		)?.textContent;
		return parsedInitiative ? parseInt(parsedInitiative) : undefined;
	}

	parseAbilityScore(n) {
		const container = isMobile()
			? ".ct-main-mobile__ability"
			: isTablet()
			? ".ct-main-tablet__ability"
			: ".ct-quick-info__ability";
		const parsedScore = document
			.querySelectorAll(`${container}`)
			[n]?.querySelector(".ddbc-ability-summary__secondary")?.textContent;
		return parsedScore ? parseInt(parsedScore) : undefined;
	}

	parseSense(n) {
		const container = ".ct-senses__callout";
		const parsedSense = document
			.querySelectorAll(`${container}`)
			[n]?.querySelector(".ct-senses__callout-value")?.textContent;
		return parsedSense ? parseInt(parsedSense) : undefined;
	}

	parseSkill(n) {
		const container = ".ct-skills__item";
		// Modifier
		const parsedSkill = document
			.querySelectorAll(`${container}`)
			[n]?.querySelector(".ct-skills__col--modifier")?.textContent;
		const parsedSkillValue = parsedSkill ? parseInt(parsedSkill) : undefined;
		// Proficiency
		const proficiencyMap = {
			"Not Proficient": 0,
			Proficient: 1,
			Expert: 2,
			"Half Proficient": 0.5,
		};
		const parsedSkillProficiencyLabel = document
			.querySelectorAll(`${container}`)
			[n]?.querySelector(".ct-skills__col--proficiency span").ariaLabel;
		const parseSkillProficiency = parsedSkillProficiencyLabel
			? proficiencyMap[parsedSkillProficiencyLabel]
			: undefined;
		return { value: parsedSkillValue, proficiency: parseSkillProficiency };
	}
}

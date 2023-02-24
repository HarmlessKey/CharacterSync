class DndBeyondCharacter extends Character {
	constructor() {
		super("DndBeyond");
	}

	updateCharacter() {
		if(!this.source) {
			this.source = "DndBeyond";
		}
		this.url = window.location.href;

		this.setName(this.parseName());

		this.setAvatar(this.parseAvatar());

		this.setLevel(this.parseLevel());

		this.setXp(this.parseXp());

		this.setArmorClass(this.parseArmorClass());

		this.setMaxHitPoints(this.parseMaxHitPoints())

		this.setWalkingSpeed(this.parseWalkingSpeed());

		this.setInitiative(this.parseInitiative());

		["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].forEach((ability, i) => {
			this.setAbilityScore(ability, this.parseAbilityScore(i));
		});
-
		console.log("updated character to:", this);
	}

	parseName() {
		const parsedName = document.querySelector('.ddbc-character-tidbits__heading h1')?.textContent
		return parsedName ?? null;
	}


	parseAvatar() {
		const avatar_style = document.querySelector('.ddbc-character-avatar__portrait')?.style.backgroundImage;
		const url_regex = /url\([\"\'\`](.+)[\"\'\`]\)/
		const avatar_match = avatar_style?.match(url_regex)

		return avatar_match ? avatar_match[1] : "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png";
	}

	parseLevel() {
		let level = document.querySelector('.ddbc-character-progression-summary__level')?.textContent;
		if (!level) {
			// Non Milestone leveling
			const xp_container = document.querySelector('.ddbc-character-progression-summary__xp-bar');
			level = xp_container?.querySelector('.ddbc-xp-bar__item--cur .ddbc-xp-bar__label')?.textContent;
		}

		const parsedLevel = level?.match(/\d+/).join();
		return parseInt(parsedLevel) ?? null;
	}

	parseXp() {
		const xp_container = document.querySelector('.ddbc-character-progression-summary__xp-bar');
		if (!xp_container) {
			return null;
		}
		const xp_data = xp_container.querySelector('.ddbc-character-progression-summary__xp-data')?.textContent?.split('/');
		return xp_data ? parseInt(xp_data[0].trim()) : null;		
	}

	parseArmorClass() {
		if (isMobile()) {
			const armor_class = document.querySelector('.ct-combat-mobile__extra--ac .ct-combat-mobile__extra-value')?.textContent;
			return parseInt(armor_class) ?? null;
		}
		const armor_class = document.querySelector('.ddbc-armor-class-box .ddbc-armor-class-box__value')?.textContent;
		return parseInt(armor_class) ?? null;
	}

	parseMaxHitPoints() {
		if (isDesktop()) {
			const hit_point_items = document.querySelectorAll('.ct-health-summary__hp-item')
			if (hit_point_items.length == 0) {
				return 0;
			}
			const max_hit_points = hit_point_items[hit_point_items.length - 1].lastChild.textContent;
			return parseInt(max_hit_points) ?? 0;
			
		}	else {
			// Open health-manager panel by clicking on health data
			document.querySelector('.ct-status-summary-mobile__data')?.click()
			const health_manager = document.querySelector('.ct-health-manager');
			if (health_manager) {
				const max_hit_points = document.querySelector('.ct-health-manager__health-max-current').textContent;
				// Close health-manager panel by clicking on close button
				document.querySelector('.ct-quick-nav__edge-toggle--visible')?.click();
				return parseInt(max_hit_points) ?? 0;
			}
		}
	}

	parseWalkingSpeed() {
		const container = isMobile() ? ".ct-combat-mobile__extra--speed" : isTablet() ? ".ct-combat-tablet__extra--speed" : ".ct-speed-box__box-value";
		const parsedWalkingSpeed = document.querySelector(`${container} .ddbc-distance-number .ddbc-distance-number__number`)?.textContent;
		return parseInt(parsedWalkingSpeed) ?? 0;
	}

	parseInitiative() {
		const container = isMobile() ? ".ct-combat-mobile__extra--initiative" : isTablet() ? ".ct-combat-tablet__extra--initiative" : ".ct-initiative-box__value";
		const parsedInitiative = document.querySelector(`${container} .ddbc-signed-number .ddbc-signed-number__number`)?.textContent;
		return parseInt(parsedInitiative) ?? 0;
	}

	parseAbilityScore(n) {
		const container = isMobile() ? ".ct-main-mobile__ability" : isTablet() ? ".ct-main-tablet__ability" : ".ct-quick-info__ability";
		const parsedScore = document.querySelectorAll(`${container}`)[n]?.querySelector('.ddbc-ability-summary__secondary')?.textContent;
		return parseInt(parsedScore) ?? 0;
	}
}
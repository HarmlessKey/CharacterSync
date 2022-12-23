class DndBeyondCharacter extends Character {
	constructor() {
		super("DndBeyond");
	}

	updateCharacter() {
		if (!this.url) {
			this.url = window.location.href;
		}

		if (!this.name) {
			this.setName(this.parseName());
		}

		if (!this.avatar) {
			this.setAvatar(this.parseAvatar());
		}

		if (!this.level) {
			this.level = 1;
		}

		if (!this.armor_class) {
			this.setArmorClass(this.parseArmorClass());
		}

		if (!this.max_hit_points) {
			this.setMaxHitPoints(this.parseMaxHitPoints())
		}

		console.log(this);
	}

	parseName() {
		const parsedName = document.querySelector('.ddbc-character-tidbits__heading h1')?.textContent
		return parsedName ?? null;
	}

	parseAvatar() {
		const avatar_style = document.querySelector('.ddbc-character-avatar__portrait')?.style.backgroundImage;
		const url_regex = /url\([\"\'\`](.+)[\"\'\`]\)/
		const avatar_url = avatar_style?.match(url_regex)[1]
		return avatar_url ?? null;
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
			// Open health-manager panel by clickin on health data
			document.querySelector('.ct-status-summary-mobile__data')?.click()
			const health_manager = document.querySelector('.ct-health-manager');
			if (health_manager) {
				const max_hit_points = document.querySelector('.ct-health-manager__health-max-current').textContent;
				// Close health-manager panel by clickin on close button
				document.querySelector('.ct-quick-nav__edge-toggle--visible')?.click();
				return parseInt(max_hit_points) ?? 0;
			}
		}
	}
}
class Character {
	constructor(type) {
		this.type = type;
		this.url = null;
		this.name = null;
		this.avatar = null;
		this.level = null;
		this.xp = null;
		this.armor_class = 0;
		this.hit_points = 0;
		this.max_hit_points = 0;
		this.temp_hit_points = 0;
		this.walking_speed = 0;
		this.initiative = 0;
		this.strength = 0;
		this.dexterity = 0;
		this.constitution = 0;
		this.intelligence = 0;
		this.wisdom = 0;
		this.charisma = 0;
		this.senses = {
			passive_perception: 0,
			passive_investigation: 0,
			passive_insight:0
		}
	}

	getUrl() {
		return this.url
	}
	setUrl(url) {
		this.url = url;
	}
	
	getName() {
		return this.name
	}
	setName(name) {
		if (name !== undefined)
			this.name = name;
	}
	
	getAvatar() {
		return this.avatar
	}
	setAvatar(avatar) {
		if (avatar !== undefined)
			this.avatar = avatar;
	}
	
	getLevel() {
		return this.level
	}
	setLevel(level) {
		if (level !== undefined)
			this.level = level;
	}

	getXp() {
		return this.xp
	}
	setXp(xp) {
		if (xp !== undefined)
			this.xp = xp;
	}
	
	getArmorClass() {
		return this.armor_class
	}
	setArmorClass(armor_class) {
		if (armor_class !== undefined)
			this.armor_class = armor_class;
	}
	
	getHitPoints() {
		return this.hit_points
	}
	setHitPoints(hit_points) {
		if (hit_points !== undefined)
			this.hit_points = hit_points;
	}
	
	getMaxHitPoints() {
		return this.max_hit_points
	}
	setMaxHitPoints(max_hit_points) {
		if (max_hit_points !== undefined)
			this.max_hit_points = max_hit_points;
	}
	
	getTempHitPoints() {
		return this.temp_hit_points
	}
	setTempHitPoints(temp_hit_points) {
		if (temp_hit_points !== undefined)
			this.temp_hit_points = temp_hit_points;
	}

	getWalkingSpeed() {
		return this.walking_speed;
	}
	setWalkingSpeed(walking_speed) {
		if (walking_speed !== undefined)
			this.walking_speed = walking_speed;
	}

	getInitiative() {
		return this.initiative;
	}
	setInitiative(initiative) {
		if (initiative !== undefined)
			this.initiative = initiative;
	}

	getAbilityScore(ability) {
		return this[ability]
	}
	setAbilityScore(ability, score) {
		if (score !== undefined)
			this[ability] = score;
	}

	getSense(sense) {
		return this.senses[sense];s
	}
	setSense(sense, score) {
		if (score !== undefined)
			this.senses[sense] = score;
	}
	
	getDict() {
		return {
			"source": this.type,
			"url": this.url,
			"name": this.name,
			"avatar": this.avatar,
			"level": this.level,
			"armor_class": this.armor_class,
			"max_hit_points": this.max_hit_points,
			"walking_speed": this.walking_speed,
			"initiative": this.initiative,
			"strength": this.strength,
			"dexterity": this.dexterity,
			"constitution": this.constitution,
			"intelligence": this.intelligence,
			"wisdom": this.wisdom,
			"charisma": this.charisma,
			"senses": this.senses
		}
	}
}
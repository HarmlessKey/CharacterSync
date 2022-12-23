class Character {
	constructor(type) {
		this.type = type,
		this.url = null,
		this.name = null,
		this.avatar = null,
		this.level = null,
		this.armor_class = null,
		this.hit_points = 0,
		this.max_hit_points = 0,
		this.temp_hit_points = 0
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
		this.name = name;
	}
	
	getAvatar() {
		return this.avatar
	}
	setAvatar(avatar) {
		this.avatar = avatar;
	}
	
	getLevel() {
		return this.level
	}
	setLevel(level) {
		this.level = level;
	}
	
	getArmorClass() {
		return this.armor_class
	}
	setArmorClass(armor_class) {
		this.armor_class = armor_class;
	}
	
	getHitPoints() {
		return this.hit_points
	}
	setHitPoints(hit_points) {
		this.hit_points = hit_points;
	}
	
	getMaxHitPoints() {
		return this.max_hit_points
	}
	setMaxHitPoints(max_hit_points) {
		this.max_hit_points = max_hit_points;
	}
	
	getTempHitPoints() {
		return this.temp_hit_points
	}
	setTempHitPoints(temp_hit_points) {
		this.temp_hit_points = temp_hit_points;
	}
	


	getDict() {
		return {
			"url": this.url,
			"name": this.name,
			"avatar": this.avatar,
			"level": this.level,
			"armor_class": this.armor_class,
			"hit_points": this.hit_points,
			"max_hit_points": this.max_hit_points,
			"temp_hit_points": this.temp_hit_points
		}
	}
}
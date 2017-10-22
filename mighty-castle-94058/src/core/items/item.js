module.exports.Item = class Item {
	constructor(id, name, description, reviews, storeId) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.reviews = reviews;
		this.storeId = storeId;
	}
};
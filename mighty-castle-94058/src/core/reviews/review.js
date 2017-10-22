module.exports.Review = class Review {
	constructor(description, rating, storeId, itemId) {
		this.description = description;
		this.rating = rating;
		this.storeId = storeId;
		this.itemId = itemId;
	}
};
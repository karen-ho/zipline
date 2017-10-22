var ReviewDao = require('./reviewDao.js').ReviewDao;
var Review = require('./review.js').Review;

class ReviewController {
	constructor() {
		this.reviewDao = new ReviewDao();
	}

	get(id) {
		return this.reviewDao.get(id);
	}

	find(storeId, itemId, filters) {
		return this.reviewDao.find(Object.assign({storeId, itemId}, filters));
	}

	create(description, rating, storeId, itemId) {
		return this.reviewDao.create(new Review(description, rating, storeId, itemId));
	}
}

module.exports.ReviewController = ReviewController;
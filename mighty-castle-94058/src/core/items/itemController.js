var ItemDao = require('./itemDao.js').ItemDao;
var ReviewDao = require('../reviews/reviewDao.js').ReviewDao;

class ItemController {
	constructor() {
		this.itemDao = new ItemDao();
		this.reviewDao = new ReviewDao();
	}

	find(storeId, filters) {
		return new Promise((resolve, reject) => {
			return Promise.all([
				this.itemDao.find(Object.assign({storeId}, filters)),
				this.reviewDao.find(Object.assign({storeId}))]).then(resp => {
					let items = resp[0];
					let reviews = resp[1];

					let reviewToItems = reviews.reduce((acc, review) => {
						acc[review.itemId] = review;
						return acc;
					}, {});
					items.forEach(item => {
						item.reviews = reviewToItems[item._id];
					});
					resolve(items);
				});
		});
	}

	create(item) {
		return this.itemDao.create(item);
	}
}

module.exports.ItemController = ItemController;
var StoreDao = require('./storeDao.js').StoreDao;

class StoreController {
	constructor() {
		this.storeDao = new StoreDao();
	}

	get(id) {
		return this.storeDao.get(id);
	}

	find(filters) {
		return this.storeDao.find(filters);
	}

	create(store) {
		return this.storeDao.create(store);
	}
}

module.exports.StoreController = StoreController;
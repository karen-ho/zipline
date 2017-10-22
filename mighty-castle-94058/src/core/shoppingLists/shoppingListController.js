var ShoppingListDao = require('./shoppingListDao.js').ShoppingListDao;

class ShoppingListController {
	constructor() {
		this.shoppingListDao = new ShoppingListDao();
	}

	get(id) {
		return this.shoppingListDao.get(id);
	}

	create(shoppingList) {
		return this.shoppingListDao.create(shoppingList);
	}
}

module.exports.ShoppingListController = ShoppingListController;
var request = require('request');
var fs = require('fs');
var ShoppingListDao = require('../shoppingLists/shoppingListDao.js').ShoppingListDao;

class SuggestionController {
	constructor() {
		this.shoppingListDao = new ShoppingListDao();
	}

	getSuggestions(cart) {
		return new Promise((resolve, reject) => {
			this.shoppingListDao.find({ items: { $all: cart } })
				.then(records => {
					resolve(records);
				});
		});
	}
}

module.exports.SuggestionController = SuggestionController;
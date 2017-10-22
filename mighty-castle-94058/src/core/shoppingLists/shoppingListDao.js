var Dao = require('../../shared/dao.js').Dao;

module.exports.ShoppingListDao = class ShoppingListDao extends Dao { 
	constructor() {
		super('shoppingLists');
	}
};
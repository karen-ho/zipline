var Dao = require('../../shared/dao.js').Dao;

module.exports.ItemDao = class ItemDao extends Dao { 
	constructor() {
		super('items');
	}
};
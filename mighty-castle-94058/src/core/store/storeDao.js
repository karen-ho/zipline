var Dao = require('../../shared/dao.js').Dao;

module.exports.StoreDao = class StoreDao extends Dao {
	constructor() {
		super('stores');
	}
};
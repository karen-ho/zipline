var Dao = require('../../shared/dao.js').Dao;

module.exports.OfferByUserDao = class OfferByUserDao extends Dao { 
	constructor() {
		super('offers_by_users');
	}
};
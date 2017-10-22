var Dao = require('../../shared/dao.js').Dao;

module.exports.OfferDao = class OfferDao extends Dao { 
	constructor() {
		super('offers');
	}
};
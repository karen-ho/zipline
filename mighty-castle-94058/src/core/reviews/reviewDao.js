var Dao = require('../../shared/dao.js').Dao;

module.exports.ReviewDao = class ReviewDao extends Dao { 
	constructor() {
		super('reviews');
	}
};
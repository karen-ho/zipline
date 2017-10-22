//var VisaDirect = require('./visaDirect.js').VisaDirect;
var VisaCyberSourcePayments = require('./visaCyberSource.js').VisaCyberSourcePayments;

class CheckoutController {
	constructor() {
		// this.visaDirect = new VisaDirect();
		this.VisaCyberSourcePayments = new VisaCyberSourcePayments();
	}

	createSale(amount, card, storeId) {
		return this.VisaCyberSourcePayments.createSale(amount, card, storeId);
	}
}

module.exports.CheckoutController = CheckoutController;
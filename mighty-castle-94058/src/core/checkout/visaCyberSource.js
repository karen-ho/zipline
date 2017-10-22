var crypto = require('crypto');
var StoreDao = require('../store/storeDao.js').StoreDao;
var request = require('request');

class VisaCyberSourcePayments {
	constructor() {
		this.storeDao = new StoreDao();
	}

	createSale(amount, card, storeId) {
		return this.storeDao.get(storeId).then(stores => {
			let store = stores[0];
			let resourcePath = 'payments/v1/sales';
			let apiKey = store.visaApiKey;
			let queryParams = `apikey=${apiKey}`;
			let url = `https://sandbox.api.visa.com/cybersource/${resourcePath}?${queryParams}`;

			let paymentSaleRequest = `{
				"amount": "${amount}",
				"currency": "USD",
				"payment": ${JSON.stringify({
					cardNumber: card.number,
					cardExpirationMonth: card.expirationMonth,
					cardExpirationYear: card.expirationYear
				})}
			}`;

			return new Promise((resolve, reject) => request({
				method: 'POST',
				url,
				headers: {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
					'x-pay-token': this.getXPayToken(resourcePath, queryParams, paymentSaleRequest, store.visaSharedSecret)
				},
				body: paymentSaleRequest
			}, function (error, response, body) {
				resolve(body);
			}));
		});
	}

	/**
		from Visa Developers Node example
	*/
	getXPayToken(resourcePath , queryParams , postBody, sharedSecret) {
		var timestamp = Math.floor(Date.now() / 1000);
		var preHashString = timestamp + resourcePath + queryParams + postBody;
		var hashString = crypto.createHmac('SHA256', sharedSecret).update(preHashString).digest('hex');
		var preHashString2 = resourcePath + queryParams + postBody;
		var hashString2 = crypto.createHmac('SHA256', sharedSecret).update(preHashString2).digest('hex');
		var xPayToken = 'xv2:' + timestamp + ':' + hashString;
		return xPayToken;
	}
}

module.exports.VisaCyberSourcePayments = VisaCyberSourcePayments;
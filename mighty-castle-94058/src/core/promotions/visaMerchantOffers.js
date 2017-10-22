var request = require('request');
var fs = require('fs');
const communityCode = 'SANDBOX';
const OfferByUserDao = require('./offerByUserDao.js').OfferByUserDao;
const OfferDao = require('./offerDao.js').OfferDao;

class VisaMerchantOffers {
	constructor() {
		this.offerByUserDao = new OfferByUserDao();
		this.offerDao = new OfferDao();
	}

	getOffers(merchantIds) {
		let req = request.defaults();
		let uri = `https://sandbox.api.visa.com/vmorc/offers/v1/byfilter?merchant=${merchantIds}`;
		return new Promise((resolve, reject) => req.get({
			uri,
			key: fs.readFileSync(process.env.VISA_KEY_FILE),
			cert: fs.readFileSync(process.env.VISA_CERT_FILE),
			headers: {
				'Content-Type' : 'application/json',
				'Accept' : 'application/json',
				'Authorization' : 'Basic ' + new Buffer(process.env.VISA_USER_ID + ':' + process.env.VISA_PASSWORD).toString('base64')
			},
		}, function(error, response, body) {
			resolve(body);
		}));
	}

	claimOffer(userAccount, offerId, subtotal) {
		delete userAccount.subtotal;
		let userDetails = Object.assign({}, userAccount, { communityCode });
		delete userDetails.cards;
		delete userDetails.contacts;
		let externalUserId = userAccount.externalUserId;
		let userDetailsStr = JSON.stringify(userDetails);
		let enrollRequestStr = '{"userDetails": ' + userDetailsStr.slice(0, -1) + ', "cards":' + JSON.stringify(userAccount.cards)
			+ ', "contacts": ' + JSON.stringify(userAccount.contacts || []) + '}}';

		let url = 'https://sandbox.api.visa.com/vop/v1/users/enroll';
		return new Promise((resolve, reject) => request({
			method: 'POST',
			url,
			key: fs.readFileSync(process.env.VISA_KEY_FILE),
			cert: fs.readFileSync(process.env.VISA_CERT_FILE),
			headers: {
				'Content-Type' : 'application/json',
				'Accept' : 'application/json',
				'Authorization' : 'Basic ' + new Buffer(process.env.VISA_USER_ID + ':' + process.env.VISA_PASSWORD).toString('base64')
			},
			body: enrollRequestStr
		}, (error, response, bodyStr) => {
			if (error) {
				return reject(error);
			}

			let body = JSON.parse(bodyStr);
			if (!body || !body.userDetails) {
				return reject(body);
			}

			let userId = body.userDetails.userId;
			let cardId = ((body.cards || [])[0] || {}).cardId;

			this.offerDao.find({ offerId }).then(offers => {
				if (!offers || !offers.length) {
					return reject('could not find offer');
				}

				let offer = offers[0];
				let rewardAmount = Math.min((offer.percentRate * subtotal) + (+offer.flatRate), subtotal);

				resolve(this.activateOffer(offerId).
					then(activatedOffer => this.applyOffer(userId, cardId, externalUserId, rewardAmount)).
					then(res => this.offerByUserDao.create({ userId, cardId, externalUserId, rewardAmount })));
			});
		}));
	}

	onboardMerchant(merchantId, merchantName) {
		let url = 'https://sandbox.api.visa.com/vop/v1/merchants/onboard';
		let merchantDetails = [{
			visaMerchantId: merchantId,
			visaMerchantName: merchantName
		}];

		return new Promise((resolve, reject) => request({
			method: 'POST',
			url,
			key: fs.readFileSync(process.env.VISA_KEY_FILE),
			cert: fs.readFileSync(process.env.VISA_CERT_FILE),
			headers: {
				'Content-Type' : 'application/json',
				'Accept' : 'application/json',
				'Authorization' : 'Basic ' + new Buffer(process.env.VISA_USER_ID + ':' + process.env.VISA_PASSWORD).toString('base64')
			},
			body: `{"communityCode": "${communityCode}", "merchantDetails":` + JSON.stringify(merchantDetails) + '}'
		}, function (error, response, body) {
			resolve(body);
		}));
	}

	createOffer(name, description, startDate, endDate) {
		let url = 'https://sandbox.api.visa.com/vop/v1/offers/createwithevent';
		let offer = { name, description, communityCode, startDate, endDate };

		return new Promise((resolve, reject) => request({
			method: 'POST',
			url,
			key: fs.readFileSync(process.env.VISA_KEY_FILE),
			cert: fs.readFileSync(process.env.VISA_CERT_FILE),
			headers: {
				'Content-Type' : 'application/json',
				'Accept' : 'application/json',
				'Authorization' : 'Basic ' + new Buffer(process.env.VISA_USER_ID + ':' + process.env.VISA_PASSWORD).toString('base64')
			},
			body: JSON.stringify(offer)
		}, function (error, response, body) {
			resolve(body);
		}));
	}

	activateOffer(offerId) {
		let payload = {
			offerId,
			communityCode
		};
		let url = 'https://sandbox.api.visa.com/vop/v1/activations/merchant';
		return new Promise((resolve, reject) => request({
			method: 'POST',
			url,
			key: fs.readFileSync(process.env.VISA_KEY_FILE),
			cert: fs.readFileSync(process.env.VISA_CERT_FILE),
			headers: {
				'Content-Type' : 'application/json',
				'Accept' : 'application/json',
				'Authorization' : 'Basic ' + new Buffer(process.env.VISA_USER_ID + ':' + process.env.VISA_PASSWORD).toString('base64')
			},
			body: JSON.stringify(payload)
		}, function (error, response, body) {
			resolve(body);
		}));
	}

	applyOffer(userId, cardId, externalClientId, rewardAmount) {
		let url = 'https://sandbox.api.visa.com/vop/v1/rewards/credit';
		let payload = {
			communityCode,
			userId,
			cardId,
			rewardAmount
		};

		return new Promise((resolve, reject) => request({
			method: 'POST',
			url,
			key: fs.readFileSync(process.env.VISA_KEY_FILE),
			cert: fs.readFileSync(process.env.VISA_CERT_FILE),
			headers: {
				'Content-Type' : 'application/json',
				'Accept' : 'application/json',
				'Authorization' : 'Basic ' + new Buffer(process.env.VISA_USER_ID + ':' + process.env.VISA_PASSWORD).toString('base64')
			},
			body: JSON.stringify(payload)
		}, function (error, response, body) {
			resolve(body);
		}));
	}
}

module.exports.VisaMerchantOffers = VisaMerchantOffers;
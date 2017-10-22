const VisaMerchantOffers = require('./visaMerchantOffers.js').VisaMerchantOffers;
var StoreDao = require('../store/storeDao.js').StoreDao;
var OfferDao = require('./offerDao.js').OfferDao;

class PromotionController {
	constructor() {
		this.storeDao = new StoreDao();
		this.offerDao = new OfferDao();
		this.visaMerchantOffers = new VisaMerchantOffers();
	}

	getOffers(storeId) {
//		return this.visaMerchantOffers.getOffers(merchantId);
		return this.offerDao.find({storeId});
	}

	claimOffer(userAccount, offerId, subtotal) {
		return this.visaMerchantOffers.claimOffer(userAccount, offerId, subtotal);
	}

	onboardMerchant(storeId) {
		return this.storeDao.get(storeId).then(stores => {
			let store = stores[0];
			return this.visaMerchantOffers.onboardMerchant(store.merchantId, store.name);
		});
	}

	createOffer(name, description, startDate, endDate, percentRate, flatRate, storeId) {
		return this.visaMerchantOffers.createOffer(name, description, startDate, endDate).then(offerStr => {
			let offer = JSON.parse(offerStr);
			return this.offerDao.create({
				name, description, startDate, endDate, percentRate, flatRate,
				offerId: offer.offerId,
				storeId: storeId
			});
		});
	}
}

module.exports.PromotionController = PromotionController;
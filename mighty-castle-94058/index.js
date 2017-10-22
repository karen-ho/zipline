const StoreController = require('./src/core/store/storeController.js').StoreController;
const ItemController = require('./src/core/items/itemController.js').ItemController;
const ReviewController = require('./src/core/reviews/reviewController.js').ReviewController;
const PromotionController = require('./src/core/promotions/promotionController.js').PromotionController;
const ShoppingListController = require('./src/core/shoppingLists/shoppingListController.js').ShoppingListController;
const CheckoutController = require('./src/core/checkout/checkoutController.js').CheckoutController;
const SuggestionController = require('./src/core/suggestions/suggestionController.js').SuggestionController;
const bodyParser = require('body-parser');

var express = require('express');
var app = express();

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// store endpoints
app.get('/api/v1/stores', (req, res) => {
	let filters = JSON.parse(req.query.filter);
	let storeController = new StoreController();
	storeController.find(filters).then(resp => {
		res.send(resp);
	}, resp => {
		res.send('failed... ' + resp);
	});
});

app.post('/api/v1/stores', (req, res) => {
	let store = req.body;
	let storeController = new StoreController();
	storeController.create(store).then(resp => {
		res.send(resp);
	}, resp => {
		res.send('failed... ' + resp);
	});
});
	
app.get('/api/v1/stores/:storeId', (req, res) => {
	let storeId = req.params.storeId;
	let storeController = new StoreController();

	storeController.get(storeId).then(resp => {
		res.send(resp);
	}, resp => {
		res.send('failed... ' + resp);
	});
});

app.post('/api/v1/stores/:storeId/pay', (req, res) => {
	let storeId = req.params.storeId;
	let amount = req.body.amount;
	let card = {
		number: req.body.cardNumber,
		expirationMonth: req.body.cardExpirationMonth,
		expirationYear: req.body.cardExpirationYear
	};
	let checkoutController = new CheckoutController();

	checkoutController.createSale(amount, card, storeId).then(resp => {
		res.send(resp);
	}, resp => {
		res.send('failed... ' + resp);
	});
});

app.get('/api/v1/stores/:storeId/items', (req, res) => {
	let storeId = req.params.storeId;
	let itemController = new ItemController();

	itemController.find(storeId, {}).then(resp => {
		res.send(resp);
	}, resp => {
		res.send('failed... ' + resp);
	});
});

app.post('/api/v1/stores/:storeId/items', (req, res) => {
	let storeId = req.params.storeId;
	let item = Object.assign({storeId}, req.body);
	let itemController = new ItemController();

	itemController.create(item).then(resp => {
		res.send(resp);
	}, resp => {
		res.send('failed... ' + resp);
	});
});

app.post('/api/v1/stores/:storeId/items/:itemId/reviews', (req, res) => {
	let storeId = req.params.storeId;
	let itemId = req.params.itemId;
	let description = req.body.description;
	let rating = req.body.rating;

	let reviewController = new ReviewController();
	reviewController.create(description, rating, storeId, itemId).then(resp => {
		res.send(resp);
	}, resp => {
		res.send('failed... ' + resp);
	});
});

app.get('/api/v1/stores/:storeId/promotions', (req, res) => {
	let storeId = req.params.storeId;

	let promotionController = new PromotionController();
	promotionController.getOffers(storeId).then(resp => {
		res.send(resp);
	}, resp => {
		res.send('failed... ' + resp);
	});
});

app.post('/api/v1/stores/:storeId/promotions/create', (req, res) => {
	let storeId = req.params.storeId;
	let name = req.body.name;
	let description = req.body.description;
	let startDate = req.body.startDate;
	let endDate = req.body.endDate;
	let percentRate = req.body.percentRate;
	let flatRate = req.body.flatRate;

	let promotionController = new PromotionController();
	promotionController.createOffer(name, description, startDate, endDate, percentRate, flatRate, storeId).then(resp => {
		res.send(resp);
	}, resp => {
		res.send('failed... ' + resp);
	});
});

app.post('/api/v1/stores/:storeId/promotions/enroll', (req, res) => {
	let storeId = req.params.storeId;
	let promotionController = new PromotionController();
	promotionController.onboardMerchant(storeId).then(resp => {
		res.send(resp);
	}, resp => {
		res.send('failed... ' + resp);
	});
});

/**
	example:
		body: {
	        "firstName": "Homer",
	        "lastName": "Simpson",
	        "userKey": "54893534",
	        "cardNumber": "4321114156363002",
	        "nameOnCard": "US-BANK"
	        "contactType": "SMS",
	        "contactCountryCode": "1",
	        "isContactVerified": "false",
	        "isPreferred": "true",
	        "subtotal": "100"
		}
*/
app.post('/api/v1/promotions/:offerId', (req, res) => {
	let offerId = req.params.offerId;
	let body = {
		externalUserId: req.body.userKey,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		userKey: req.body.userKey,
		cards: [{
			cardNumber: req.body.cardNumber,
			nameOnCard: req.body.nameOnCard
		}],
		contacts: [{
			type: req.body.contactType,
			value: req.body.userKey,
			countryCode: req.body.contactCountryCode,
			isContactVerified: req.body.isContactVerified,
			isPreferred: req.body.isPreferred
		}]
	};

	let promotionController = new PromotionController();
	promotionController.claimOffer(body, offerId, req.body.subtotal).then(resp => {
		res.send(resp);
	}, resp => {
		res.send('failed... ' + resp);
	});
});

// shopping-list
app.get('/api/v1/shopping-lists/:shoppingListId', (req, res) => {
	let shoppingListId = req.params.shoppingListId;
	let shoppingListController = new ShoppingListController();
	shoppingListController.get(shoppingListId).then(resp => {
		res.send({ items: resp });
	}, resp => {
		res.send('failed... ' + resp);
	});
});

app.post('/api/v1/shopping-lists', (req, res) => {
	let shoppingList = req.body.items;
	let shoppingListController = new ShoppingListController();
	shoppingListController.create({items: shoppingList}).then(resp => {
		res.send(resp);
	}, resp => {
		res.send('failed... ' + resp);
	});
});

// suggestions
app.post('/api/v1/suggestions', (req, res) => {
	let cart = req.body.items;
	let suggestionController = new SuggestionController();
	suggestionController.getSuggestions(cart).then(resp => {
		res.send(resp);
	}, resp => {
		res.send('failed... ' + resp);
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

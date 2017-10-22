var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

module.exports.Dao = class Dao {
	constructor(model) {
		let url = process.env.MONGODB_URI;
		this.mongoClient = new Promise((resolve, reject) => {
			MongoClient.connect(url, (err, db) => {
				if (err) {
					reject('failed to connect');
					return;
				}

				this.db = db;
				resolve(db.collection(model));
			});
		});
	}

	get(id) {
		return new Promise((resolve, reject) => {
			this.mongoClient.then(collection => {
				collection.find().filter({ _id: ObjectId(id) }).limit(1).toArray((err, documents) => {
					resolve(documents);
					this.db.close();
				});
			})
		});
	}

	find(filters) {
		return new Promise((resolve, reject) => {
			this.mongoClient.then(collection => {
				collection.find().filter(filters).toArray((err, documents) => {
					resolve(documents);
					this.db.close();
				});
			})
		});
	}

	create(item) {
		return new Promise((resolve, reject) =>
			this.mongoClient.then(collection =>
				collection.insertOne(item, (err, ids) => {
					resolve(ids);
					this.db.close();
				})
			)
		);
	}
};
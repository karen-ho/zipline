class VisaDirect {
	pushFunds() {
	}

	/**
		acquirer: {
			bin,
			countryCode,	// iso
			mccCode
		},
		sender: {
			primaryAccountNumber,
			cardExpiryDate,	// YYYY-MM
		}
	*/
	generatePushFundsRequest(acquirer, sender, amount, cardAcceptor) {
		let systemsTraceAuditNumber = 1;
		let date = new Date();

		assert(!!acquiringBin);
		assert(!!acquirerCountryCode)


		return {
			systemsTraceAuditNumber: systemsTraceAuditNumber,
			retrievalReferenceNumber: `${date}${systemsTraceAuditNumber}`,
			localTransactionDateTime: new Date(),//dateTime


			businessApplicationId: 'MP',
			merchantCategoryCode: ''
			cardAcceptor,
		};
	}

	getRetrievalReferenceNumber(date, systemsTraceAuditNumber) {
		let now = new Date();
		return `${now.getYear()%10}${now.getDay}`;
	}
}

module.exports.VisaDirect = VisaDirect;
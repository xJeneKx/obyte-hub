/*jslint node: true */
'use strict';
const async = require('async');
const request = require('request');
const eventBus = require('byteballcore/event_bus.js');

const symbols = ['USDT-BTC', 'BTC-GBYTE'];
const rates = {};

function updateBittrexRates() {
	const apiUri = 'https://bittrex.com/api/v1.1/public/getmarketsummaries';
	request(apiUri, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			let arrCoinInfos = JSON.parse(body).result;
			var count = 0;
			arrCoinInfos.forEach(coinInfo => {
				if (!coinInfo.Last)
					return;
				if (symbols.includes(coinInfo.MarketName)) {
					rates[coinInfo.MarketName] = coinInfo.Last;
					count++;
					console.log("new exchange rate: " + coinInfo.MarketName + "=" + coinInfo.Last);
				}
			});
			if (count == symbols.length)
				eventBus.emit('rates_updated');
		}
		else {
			console.log("Can't get currency rates from bittrex");
		}
	});
}

updateBittrexRates();
setInterval(updateBittrexRates, 1000 * 60 * 10);

export.rates = rates;
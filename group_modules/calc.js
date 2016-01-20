module.exports = {
	cheapest : getCheapest
}


// Data files
var restaurants = require('../data/restaurants.json');
var activities = require('../data/activities.json');
var transport = require('../data/transport.json');

// Other modules created by us
var util = require('./util.js');


function getCheapest(file, res) {

	switch(file) {
		case 'restaurants':
			getCheapestRestaurant(res);
			break;
		case 'activities':
			getCheapestActivity();
			break;
		case 'transport':
			getCheapestTransport();
			break;
		default:
			res.end("File not recognised");
			return;
	}

}

function getCheapestRestaurant(res) {
	var r = util.getNestedObject(restaurants, "restaurants");
	var cheapest = getCheapestItem(r);
	res.end(JSON.stringify(cheapest));
}

function getCheapestActivity() {

}

function getCheapestTransport() {

}

// Generic function for getting cheapest item, based on "avg_cost" field
function getCheapestItem(obj) {
	var cheapestItems = [];
	var cheapest = 10000;

	Object.keys(obj).forEach(function(key) {

    	var item = obj[key];	// e.g. restaurant["1"]

    	if (item.avg_cost < cheapest) {
    		cheapestItems = [];	// empty array
    		cheapestItems.push(item.name + " - " + item.avg_cost);
    		cheapest = item.avg_cost;
    	} else if (item.avg_cost == cheapest) {
    		cheapestItems.push(item.name + " - " + item.avg_cost)
    	}
	});

	return cheapestItems;
}
module.exports = {
	cheapest : getCheapest,
	users : getUserId
};

// Data files
var restaurantsData = require('../data/restaurants.json');
var activitiesData = require('../data/activities.json');
var transportData = require('../data/transport.json');
var userData = require('../data/users.json');

// Other modules created by us
var util = require('./util.js');

/*
*	Cheapest Functions
* @TODO - Maybe if you go to the url /api/cheapest it will combine all of the values.
*/
// From URL, detect cheapest type request.
function getCheapest(file, res) {
	switch(file) {
		case 'restaurants':
			type = 'restaurants';
			getCheapestType(res, type);
			break;
		case 'activities':
			type = 'activities';
			getCheapestType(res, type);
			break;
		case 'transport':
			type = 'transport';
			getCheapestType(res, type);
			break;
		default:
			res.end("File not recognised");
			return;
	}
}

// Function to get data from type.
function getCheapestType(res, type) {
	switch(type) {
		case 'restaurants':
			var r = util.getNestedObject(restaurantsData, "restaurants");
			var cheapestRestaurant = getCheapestItem(r);
			res.end(JSON.stringify(cheapestRestaurant));
			break;
		case 'activities':
			var a = util.getNestedObject(activitiesData, "activities");
			var cheapestActivity = getCheapestItem(a);
			res.end(JSON.stringify(cheapestActivity));
			break;
		case 'transport':
			var t = util.getNestedObject(transportData, "transport");
			var cheapestTransport = getCheapestItem(t);
			res.end(JSON.stringify(cheapestTransport));
			break;
		default:
			res.end("Cheapest type not recognised.");
			return;
	}
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
    		cheapestItems.push(item.name + " - " + item.avg_cost);
    	}
	});

	return cheapestItems;
}

/*
*	User Activity Functions
*/
// Get User Function.
function getUserId(uid, res) {
	var user= util.getNestedObject(userData, "users");
	userItem = user[uid];
	res.end(JSON.stringify(userItem));
}

module.exports = {
	cheapest : getCheapest,
	service_match: getServiceMatch
}


// Data files
var restaurants = require('../data/restaurants.json');
var activities = require('../data/activities.json');
var transport = require('../data/transport.json');

// Other modules created by us
var util = require('./util.js');

var errors = {
	"file_not_found": "File not recognised"
};


function getCheapest(file, res) {

	var object;

	switch(file) {
		case 'restaurants':
			object = util.getNestedObject(restaurants, "restaurants");
			break;
		case 'activities':
			object = util.getNestedObject(activities, "activities");
			break;
		case 'transport':
			object = util.getNestedObject(transport, "transport");
			break;
		default:
			res.end(errors.file_not_found);
			return;
	}

	var cheapest = getCheapestItem(object);
	res.end(JSON.stringify(cheapest));	

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



// Find results based on the services they offer
function getServiceMatch(file, service, res) {

	var object;

	switch(file) {
		case 'restaurants':
			object = util.getNestedObject(restaurants, "restaurants");
			break;
		case 'activities':
			object = util.getNestedObject(activities, "activities");
			break;
		case 'transport':
			object = util.getNestedObject(transport, "transport");
			break;
		default:
			res.end(errors.file_not_found);
			return;
	}

	var matched = findRestByServices(object, service);
	res.end(JSON.stringify(matched));	
}

function findRestByServices(obj, service) {

	var suitableRest = [];

	// (a) Get number representing service from "services" object
    var services = restaurants.services;
    var servNum = getServiceValue(services, service);
	
	Object.keys(obj).forEach(function(key) {

		// (b) Get restaurant object
    	var item = obj[key];	// e.g. restaurant["1"]
    	
    	// (c) Iterate through services found in current restaurant
    	item.service_type.forEach(function(s) {
    		if (s == servNum) {
    			suitableRest.push(item.name);
    		}
    	});
	});

	return suitableRest;
}

// Returns number representing matched service
function getServiceValue(servicesObj, serviceToFind) {

	var num = null;
	Object.keys(servicesObj).forEach(function(key) {
		var service = servicesObj[key];

		// e.g. "Takeaway" is found, return its key
		if (service == serviceToFind) {
			num = Number(key);
			return;
		}
	});

	return num;
}














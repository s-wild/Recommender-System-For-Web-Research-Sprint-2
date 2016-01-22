module.exports = {
	cheapest : getCheapest,
	service_match: getServiceMatch,
	recommend : getRecommendedEntities,
	getBrandCount: getBrandCount
};

// Data files
var restaurantsData = require('../data/restaurants.json');
var activitiesData = require('../data/activities.json');
var transportData = require('../data/transport.json');

// Other modules created by us
var util = require('./util.js');
var check = require('./check.js');
var globals = require('./globals.js');
var info = require('./info.js');


function getCheapest(file, res) {

	var object;

	switch(file) {
		case 'restaurants':
			object = util.getNestedObject(restaurantsData, globals.BRANDS);
			break;
		case 'activities':
			object = util.getNestedObject(activitiesData, globals.BRANDS);
			break;
		case 'transport':
			object = util.getNestedObject(transportData, globals.BRANDS);
			break;
		default:
			res.end(errors.file_not_found);
			return;
		}

	return getCheapestItem(object);


}

/*
*	Cheapest Functions
* @TODO - Maybe if you go to the url /api/cheapest it will combine all of the values.
*/

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

// Find results based on the services they offer
function getServiceMatch(file, service, res) {

	var object, dataFile;

	switch(file) {
		case 'restaurants':
			object = util.getNestedObject(restaurantsData, globals.BRANDS);
			dataFile = restaurantsData;
			break;
		case 'activities':
			object = util.getNestedObject(activitiesData, globals.BRANDS);
			dataFile = activitiesData;
			break;
		case 'transport':
			object = util.getNestedObject(transportData, globals.BRANDS);
			dataFile = transportData;
			break;
		default:
			res.end(errors.file_not_found);
			return;
	}

	if (!check.isValidService(dataFile.services, service)) {
		res.end(errors.service_not_found);
		return;
	}

	return util.findItemByService(object, service, dataFile);
}






function getRecommendedEntities(uid, file) {

	// look at user history
	var history = info.userActivity(uid, file);

	// get most frequent



}


function getMostFrequent(historyArray) {

	var foundItems;

	historyArray.forEach(function(item) {
		// if item [1: {count: 25}, ]

		// USE SIMON'S IDEA
	});
}

function getBrandCount(uid, file, brandid) {
		var history = info.userActivity(uid, file);
		var foundItems = [];
		history.forEach(function(item) {
			if (item.brand_id == brandid) {
				foundItems.push(item);
			}

		});
		return foundItems;
}

module.exports = {
	cheapest : getCheapest,
	service_match: getServiceMatch
};

// Data files
var restaurantsData = require('../data/restaurants.json');
var activitiesData = require('../data/activities.json');
var transportData = require('../data/transport.json');


function getCheapest(file, res) {

	var object;

	switch(file) {
		case 'restaurants':
			object = util.getNestedObject(restaurantsData, "restaurants");
			break;
		case 'activities':
			object = util.getNestedObject(activitiesData, "activities");
			break;
		case 'transport':
			object = util.getNestedObject(transportData, "transport");
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
			object = util.getNestedObject(restaurantsData, "restaurants");
			dataFile = restaurantsData;
			break;
		case 'activities':
			object = util.getNestedObject(activitiesData, "activities");
			dataFile = activitiesData;
			break;
		case 'transport':
			object = util.getNestedObject(transportData, "transport");
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
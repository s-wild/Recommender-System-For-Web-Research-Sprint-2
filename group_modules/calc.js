module.exports = {
	cheapest : getCheapest,
	service_match: getServiceMatch,
	users : getUserId,
	userActivity : getUserActivity
};

// Data files
var restaurantsData = require('../data/restaurants.json');
var activitiesData = require('../data/activities.json');
var transportData = require('../data/transport.json');
var userData = require('../data/users.json');
var userAttendanceData = require('../data/user_attendances.json');

// Other modules created by us
var util = require('./util.js');


var errors = {
	"file_not_found": "File not recognised"
};

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
			res.end(errors.file_not_found);
			return;
	}

	var cheapest = getCheapestItem(object);
	res.end(JSON.stringify(cheapest));
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

// Find restaurant by supplying a service
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


/*
*	User + User Activity Functions
*/
// Get User Function.
function getUserId(uid, res) {
	var user = util.getNestedObject(userData, "users");
	userItem = user[uid];
	res.end(JSON.stringify(userItem));
}

// Get User Activity Type
function getUserActivity(uid, file, res) {
	var userAttendances = util.getNestedObject(userAttendanceData, "user_attendance");
	var attendanceItems = util.findId(userAttendances, "user_id", uid);
	res.end(JSON.stringify(attendanceItems));
}

function getUserActivityType(userData, user_id, type, res) {
	var attendance = util.getNestedObject(userAttendanceData, "user_attendance");
	//res.end(JSON.stringify(attendance));
}

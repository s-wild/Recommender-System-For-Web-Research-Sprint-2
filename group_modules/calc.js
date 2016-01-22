module.exports = {
	cheapest : getCheapest,
	service_match: getServiceMatch,
	users : getUserId,
	userActivity : getUserActivityByType,
	allEntities: getAllEntities
};



// Data files
var restaurantsData = require('../data/restaurants.json');
var activitiesData = require('../data/activities.json');
var transportData = require('../data/transport.json');
var userData = require('../data/users.json');
var userHistoryData = require('../data/user_history.json');

// Other modules created by us
var util = require('./util.js');
var check = require('./check.js');


var errors = {
	"file_not_found": "File not recognised",
	"service_not_found": "Service not recognised"
};


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

	var cheapest = getCheapestItem(object);
	res.end(JSON.stringify(cheapest));

}


function getCheapestRestaurant(res) {
	var r = util.getNestedObject(restaurants, "restaurants");
	var cheapest = getCheapestItem(r);
	res.end(JSON.stringify(cheapest));
}

function getCheapestActivity(res) {
	var a = util.getNestedObject(activities, "activities");
	var cheapest = getCheapestItem(a);
	res.end(JSON.stringify(cheapest));
}

function getCheapestTransport(res) {
	var t = util.getNestedObject(transport, "transport");
	var cheapest = getCheapestItem(t);
	res.end(JSON.stringify(cheapest));
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
	var matched = util.findItemByService(object, service, dataFile);
	res.end(JSON.stringify(matched));
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

// Get User And Filter Activity. @TODO Needs finishing.
function getUserActivityByType(uid, file, res) {

	var originID = util.getNameByValue(userHistoryData.action_origin, file);
	console.log("Origin ID: %s",  originID);
	var userAttendances = util.getNestedObject(userHistoryData, "user_attendance");
	var matchedAttendenceItems = [];	// empty array

	// loop through user attendances
	Object.keys(userAttendances).forEach(function(key) {
			var userAttendanceitem = userAttendances[key];	// e.g. restaurant["1"]
			console.log("User attendance items: " + userAttendanceitem);

			if (userAttendanceitem.origin_type == originID) {


				matchedAttendenceItems.push(userAttendanceitem);
				// cheapest = item.avg_cost;
			}


	});
	return matchedAttendenceItems;

}

function getAllEntities(file, res){
	var object, dataFile;

	switch(file){
		case 'restaurants':
			object = util.getNestedObject(restaurantsData, 'restaurants');
			dataFile = restaurantsData;
			break;
		case 'transport':
			object = util.getNestedObject(transportData, 'transport');
			dataFile = transportData;
			break;
		case 'activities':
			object = util.getNestedObject(activitiesData, 'activities');
			dataFile = activitiesData;
			break;
	}
	var result = util.listServiceTitles(object, dataFile);
	res.end(JSON.stringify(result));

}

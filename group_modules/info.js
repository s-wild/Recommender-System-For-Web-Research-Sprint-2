module.exports = {
	getUser : getUserProfile,
	getUsers : getAllUserProfiles,
	userActivity : getUserActivityByType,
	allEntities : getAllEntities
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
var globals = require('./globals.js');

var errors = {
	"file_not_found": "File not recognised",
	"service_not_found": "Service not recognised"
};

/*
*	User + User Activity Functions
*/
// Get User.
function getUserProfile(uid, res) {
	var users = util.getNestedObject(userData, "users");
	return users[uid];
}

// Get All Users Profile.
function getAllUserProfiles(uid, res) {
	return util.getNestedObject(userData, "users");
}

// Get User And Filter Activity. @TODO Needs finishing.
function getUserActivityByType(uid, file) {

	var originID = util.getNameByValue(userHistoryData.origins, file);
	var userAttendances = util.getNestedObject(userHistoryData, "user_attendance");
	var matchedAttendenceItems = [];	// empty array

	// loop through user attendances
	Object.keys(userAttendances).forEach(function(key) {
			var userAttendanceitem = userAttendances[key];	// e.g. restaurant["1"]
			if (userAttendanceitem.origin == originID && userAttendanceitem.user_id == uid) {
				matchedAttendenceItems.push(userAttendanceitem);
			}

	});
	return matchedAttendenceItems;
}

function getAllEntities(file, res){
	var object, dataFile;

	switch(file){
		case 'restaurants':
			object = util.getNestedObject(restaurantsData, globals.BRANDS);
			dataFile = restaurantsData;
			break;
		case 'transport':
			object = util.getNestedObject(transportData, globals.BRANDS);
			dataFile = transportData;
			break;
		case 'activities':
			object = util.getNestedObject(activitiesData, globals.BRANDS);
			dataFile = activitiesData;
			break;
	}

	return util.listServiceTitles(object, dataFile);
}

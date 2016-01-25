module.exports = {
	getNestedObject : getNestedObject,
	findId : findId,
	getNameByValue : getNameByValue,
	findItemByService : findItemByService,
	objectLength : objectLength,
	listServiceTitles : listServiceTitles,
	getUniqueBrands : getUniqueBrands,
	getAverageRating : getAverageRating
};

// Data files
var restaurantsData = require('../data/restaurants.json');
var activitiesData = require('../data/activities.json');
var transportData = require('../data/transport.json');

// Other modules created by us
var globals = require('./globals.js');

// Gets a nested object from within JSON
function getNestedObject(json, attrName) {
	for(var attributename in json){
		// If match
    	if (attributename == attrName) {
    		// Retrieve nested object, e.g. object.potato
    		var o = json[attributename];
    		return o;
    	}
	}

	return undefined;
}

// Returns name representing matched value (in JSON terms)
function getNameByValue(parentObj, valueToFind) {

	var num = null;
	Object.keys(parentObj).forEach(function(key) {
		var value = parentObj[key];

		// e.g. "Takeaway" is found, return its key
		if (value == valueToFind) {
			num = Number(key);
			return;
		}
	});

	return num;
}

// Find item by supplying a service
function findItemByService(obj, serviceToFind, dataFile) {
	var suitableItems = [];

	// (a) Get number representing service from "services" object
    var services = dataFile.services;
    var servNum = getNameByValue(services, serviceToFind);

	Object.keys(obj).forEach(function(key) {

		// (b) Get object
    	var item = obj[key];	// e.g. restaurant["1"]

    	// (c) Iterate through services found in current restaurant
    	item.service_type.forEach(function(s) {
    		if (s == servNum) {
    			suitableItems.push(item.name);
    		}
    	});
	});

	return suitableItems;
}

function listServiceTitles(obj, service){
	var outputArray = [];
	 Object.keys(obj).forEach(function(key){
		 var item = obj[key];
		 outputArray.push(item.name);
	 });
	 return outputArray;
}

// Gets objects from within JSON based on id.
function findId(json, fieldName, idToLookFor) {
	var selected_objects = [];

	Object.keys(json).forEach(function(key) {
		var action = json[key];
		var id = action.user_id;

		if (action.user_id == idToLookFor) {
			selected_objects.push(action);
		}

	});

	return selected_objects;

}

// Counts items in objects.
function objectLength(obj) {
  var result = 0;
  for(var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      result++;
    }
  }
  return result;
}


function getEntityByOrigin(origin) {

	var file = null;



}

function getUniqueBrands(history) {

	var brandIDs = [];

	history.forEach(function(item) {
		brandIDs.push(item.brand_id);
	});


	var unique = [];
	brandIDs.forEach(function(e) {
		if (unique.indexOf(e) == -1) {
			unique.push(e);
		}
	});


	return unique;
} 

// Get average rating
function getAverageRating(file, brandID) {
	
	var avgRating = null;

	var object;
	switch(file) {
		case 'restaurants':
			object = getNestedObject(restaurantsData, globals.BRANDS);
			break;
		case 'activities':
			object = getNestedObject(activitiesData, globals.BRANDS);
			break;
		case 'transport':
			object = getNestedObject(transportData, globals.BRANDS);
			break;
	}


	// Find desired brand object
	Object.keys(object).forEach(function(brand) {

		if (brand == brandID) {
			avgRating = object[brand].avg_rating;
			return;
		}
	});

	return avgRating;
}






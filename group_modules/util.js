module.exports = {
	getNestedObject : getNestedObject,
	findId : findId,
	getNameByValue : getNameByValue,
	findItemByService : findItemByService,
	objectLength : objectLength,
	listServiceTitles : listServiceTitles,
	getUniqueBrands : getUniqueBrands,
	getAverageRating : getAverageRating,
	getBrands : getBrands,
	getFrequencyOfKeyword : getFrequencyOfKeyword,
	getFrequencyOfKeywords : getFrequencyOfKeywords,
	getBrandsByLocation : getBrandsByLocation,
	getNewestBrand : getNewestBrand
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

	var brands = getBrands(file);

	// Find desired brand object
	Object.keys(brands).forEach(function(brand) {

		if (brand == brandID) {
			avgRating = brands[brand].avg_rating;
			return;
		}
	});

	return avgRating;
}

// Get all brands found in a specified file
function getBrands(file) {
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

	return object;
}


// Get frequency of keyword
function getFrequencyOfKeyword(file, brandIDs, keyword) {
	var brands = getBrands(file);
	var count = 0;


	Object.keys(brands).forEach(function(brandID) {
		
		if (brandIDs.indexOf(Number(brandID)) != -1) {
			var brand = brands[brandID];
			var keywords = brand.keywords;

			// Get frequency
			keywords.forEach(function(word) {
				if (word.toLowerCase() == keyword.toLowerCase()) {
					count += 1;
					return;
				}
			});

			//console.log(brand.keywords);
		}
	});

	return count;
}

// Get frequency of keywords for a particular brand
function getFrequencyOfKeywords(brand, keywords) {
	//console.log("Brand is %s and keywords to look for are %s", brand, keywords);
	var freq = 0;

	var lowercaseWords = [];

	// Convert all keywords to lowercase, for comparison
	brand.keywords.forEach(function(word) {
		lowercaseWords.push(word.toLowerCase());
	});

	// Check for match
	Object.keys(keywords).forEach(function(key) {
		var word = keywords[key].word;
		if (word == null) return;	// if no history, return
		
		if (lowercaseWords.indexOf(word.toLowerCase()) != -1) {
			freq += 1;
		}
	});

	return freq;

}


// Get brands that reside in a particular location
function getBrandsByLocation(file, location) {

	var brands = getBrands(file);

	var localBrands = [];

	Object.keys(brands).forEach(function(brandID) {

		var brand = brands[brandID];
		var lowercaseLocations = [];

		// Convert all locations to lowercase, for comparison
		brand.locations.forEach(function(location) {
			lowercaseLocations.push(location.name.toLowerCase());
		});

		// If brand resides in location
		if (lowercaseLocations.indexOf(location.toLowerCase()) != -1) {
			brand.brand_id = brandID;	// Add brand id, so it can be used later on
			brand.brand_location = location;
			localBrands.push(brand);
		}

	});

	return localBrands;
}

// Get newest brand
function getNewestBrand(brands) {
	
	var newest = {};
	for (var i = 0; i < brands.length; i++) {
		var brand = brands[i];


		// Get brand location
		var brandLocation = brand.brand_location;

		// Get specific store opening time
		var opening_date;
		brand.locations.forEach(function(location) {
			
			// Check for same location
			if (location.name.toLowerCase() == brandLocation.toLowerCase()) {

				opening_date = location.opening_date;
			}
			
		});


		// First is youngest by default
		if (i == 0 || getAge(opening_date) < newest.age) {
			newest.age = getAge(opening_date);
			newest.details = brand;
			//break;
		}

	}

	return newest;


}

// Get age of a particular store
function getAge(date) {
	
	var today = new Date();	// now
	var opening = new Date(date);	// opening

	var diff = today.getTime() - opening.getTime(); 
	var diffInDays = diff / (1000 * 60 * 60 * 24); // In days

	//console.log(diffInDays);
	return diffInDays;

}






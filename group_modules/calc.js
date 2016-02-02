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


function getRecommendedEntities(uid, file, location) {

	// (a) Look at user history
	var history = info.userActivity(uid, file);

	// ---------- GETTING HISTORY ----------
	// (b) Get list of frequencies, pertaining to visited (array with: brand id, count)
	var frequencyList = getAttendanceFrequency(history, uid, file);

	// (c) Get share of total visits for each brand (array with: brand id, count, share)
	var visitShare = getTotalVisitShare(history.length, frequencyList);

	// (d) Get what user rated each brand (if available) during each visit (array with: brand id, count, share, avg_rating)
	var ratings = getAvUserRatings(history, visitShare, file);

	// (e) Rank brands based on share and average rating
	var rankings = rankBrands(ratings);
	
	// (f) Loop through rankings, looking for common keywords
	var commonKeywords = getCommonKeywords(rankings, file);

	// ---------- RECOMMENDING ----------
	// (g) Look at potential brands for specified location
	var targetBrands = util.getBrandsByLocation(file, location);

	// (h) Get newest restaurant
	var newest = util.getNewestBrand(targetBrands);

	// (i) Get rankings of brands to recommend
	var toRecommend = getRecommended(targetBrands, commonKeywords, newest);

	// (j) Add newest to top of list
	Array.prototype.insert = function (index, item) {
  		this.splice(index, 0, item);
	};
	toRecommend.insert(0, newest);
	toRecommend.insert(0, { "keywords_from_user_history": commonKeywords });

	// TEST LOGS
	//console.log(frequencyList);
	//console.log(visitShare);
	//console.log(ratings);
	//console.log(newRatings);
	//console.log(commonKeywords);
	//console.log(targetBrands);
	//console.log(newest);

	// extra checks depending on file
	/*
		# [ACTIVITY] if activity, consider age limit
		# [TRANSPORT] if transport, consider whether they can drive
		# [ACTIVITY+TRANSPORT] consider disability
	*/


	return toRecommend;
}

// Gets list of frequencies for each brand within a sector
function getAttendanceFrequency(historyArray, uid, file) {
	var uniqueBrandIDs = util.getUniqueBrands(historyArray);

	var brandCounts = [];
	uniqueBrandIDs.forEach(function (brandID) {
		var count = getBrandCount(uid, file, brandID).length;
		brandCounts.push({ "brand_id": brandID, "count": count });
	});
	//console.log("Unsorted Brandcounts: ", brandCounts);

	// Sort array based on descending frequency ( b - a )
	brandCounts.sort(function(a, b) { return b.count - a.count; });

	return brandCounts;
}

// Get array of visits for a particular brand
function getBrandCount(uid, file, brandID) {
	var history = info.userActivity(uid, file);
	var foundItems = [];
	history.forEach(function(item) {
		if (item.brand_id == brandID) {
			foundItems.push(item);
		}

	});
	return foundItems;
}

// Get array denoting share of total visits to a brand for particular user
function getTotalVisitShare(totalVisits, frequencyList) {

	frequencyList.forEach(function(brand) {
		var share = brand.count / totalVisits;
		// Add share property to object
		brand.share = share;
	});

	return frequencyList;
}


// Get average ratings for brand, for a particular user
function getAvUserRatingForBrand(historyArray, brandID) {
	var average = null;

	var ratings = [];
	historyArray.forEach(function(item) {
		if (item.brand_id == brandID && item.rating > 0) {
			ratings.push(item.rating);
		}
	});

	// If user has not rated brand
	if (!ratings.length) return 0;

	// Get sum of average ratings
	var sum = ratings.reduce(function(a, b) {
		return a + b;
	});

	average = sum / ratings.length;

	return average;
}


// Gets average user ratings brand-by-brand
function getAvUserRatings(historyArray, visitShare, file) {

	visitShare.forEach(function(item) {
		var brandid = item.brand_id;

		// Get average for brand
		var avg = getAvUserRatingForBrand(historyArray, brandid);
		// If user has left no rating, get average rating from all ratings for brand
		if (avg == 0) {
			item.avg_rating = util.getAverageRating(file, brandid);
		} else {
			item.avg_rating = avg;
		}


	});

	return visitShare;
}


// Rank brands using star system
function rankBrands(ratings) {

	ratings.forEach(function(item) {
		item.rating = getRating(item);
	});

	// Order based on newly added "rating"
	ratings.sort(function(a, b) { return b.rating - a.rating; });

	return ratings;
}


// Get rating based on frequency
function getRating(brand) {
	var rating = 0;

	var share = convertShareToStar(brand.share * 100);
	var avg_rating = brand.avg_rating;

	if (avg_rating == 0) {
		// Wild
		rating = share * 2;
	} else {
		// Davies
		rating = share + avg_rating;
	}

	return rating;

}

// Convert percentage of overall visits to a star / 5
function convertShareToStar(share) {
	if (share > 0 && share <= 20) {
		return 1;
	} else if (share > 21 && share <= 40) {
		return 2;
	} else if (share > 41 && share <= 60) {
		return 3;
	} else if (share > 61 && share <= 80) {
		return 4;
	} else {
		return 5;
	}
}

// Get list of common keywords for specified restaurants
function getCommonKeywords(rankedBrands, file) {
	var commonKeywords = [];
	var brandIDs = [];

	// Return something that won't throw errors, but that handlebars will recognise as a non-empty array
	if (!rankedBrands.length) return [{"no_history": "N/A"}];

	// (a) Loop through visited brands, get brand ids
	Object.keys(rankedBrands).forEach(function(brand) {
		var brandID = rankedBrands[brand].brand_id;
		brandIDs.push(brandID);
	});

	var brands = util.getBrands(file);

	// If only one brand has been visited (i.e. user has only visited one brand)
	if (brandIDs.length == 1) {
		var brand = brands[brandIDs[0]];

		// Loop through all keywords for single brand
		brand.keywords.forEach(function(word) {
			commonKeywords.push({ "word": word.toLowerCase(), "count": util.getFrequencyOfKeyword(file, brandIDs, word) });
		});

		return commonKeywords;
	}


	// (b) Get frequency of similar keywords
	Object.keys(brands).forEach(function(brandID) {
		var brand = brands[brandID];

		// If brand is one to search
		if (brandIDs.indexOf(Number(brandID)) != -1) {
			var keywords = brand.keywords;

			keywords.forEach(function(word){
				var keywordFound = commonKeywords.map(function(e) { return e.word; }).indexOf(word.toLowerCase());
				
				// Check frequency of keyword
				if (util.getFrequencyOfKeyword(file, brandIDs, word) > 1 && keywordFound == -1) {
					commonKeywords.push({ "word": word.toLowerCase(), "count": util.getFrequencyOfKeyword(file, brandIDs, word) });
				}
			});
		}
	});

	return commonKeywords;
}


// Get recommended places
function getRecommended(targetBrands, commonKeywords, newest) {

	var recommended = [];

	targetBrands.forEach(function(brand) {
		// If newest is in this list, skip over
		if (brand.brand_id == newest.details.brand_id) return;

		var keywordFreq = util.getFrequencyOfKeywords(brand, commonKeywords);
		var avgRating = brand.avg_rating;

		// Assign mean value
		var mean_value = (((keywordFreq / commonKeywords.length) + (avgRating / 5)) / 2) * 100;
		//console.log(mean_value + "%");

		recommended.push({ "mean_value": mean_value, "details": brand });

	});

	// Sort array, put highest at top
	recommended.sort(function(a, b) { return b.mean_value - a.mean_value; });


	// Return top five, or however elements we have
	if (recommended.length >= 6) return recommended.slice(0, 5);
	return recommended;
}

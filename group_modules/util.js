module.exports = {
	getNestedObject : getNestedObject,
	findId : findId,
	getServiceValue : getServiceValue,
	findItemByService : findItemByService,
	objectLength : objectLength
};

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

// Find item by supplying a service
function findItemByService(obj, service, dataFile) {
	var suitableItems = [];

	// (a) Get number representing service from "services" object
    var services = dataFile.services;
    var servNum = getServiceValue(services, service);

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

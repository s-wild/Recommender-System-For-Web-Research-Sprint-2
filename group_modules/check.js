module.exports = {
	isValidService : isValidService,
	isDefined : checkIsDefined
};


// Checks if user supplied string is in fact a valid service
function isValidService(servicesObj, serviceToFind) {
	var isValid = false;

	// Loop through services object, checking if supplied service exists
	Object.keys(servicesObj).forEach(function(s) {
		var serviceName = servicesObj[s];
		if (serviceName == serviceToFind) {
			isValid = true;
			return;
		}
	});

	return isValid;
}

// Checks if elements are defined
function checkIsDefined(array) {

	var isUndefined = true;

	// Loop through array checking for empty value
	array.forEach(function(e) {
		if (typeof(e) == 'undefined'){
			isUndefined = false;
			return;
		}
	});

	return isUndefined;
}
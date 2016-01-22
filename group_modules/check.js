module.exports = {
	isValidService : isValidService
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
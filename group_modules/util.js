module.exports = {
	getNestedObject : getNestedObject,
	findId : findId,
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

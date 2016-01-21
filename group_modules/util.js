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
	size = objectLength(json);
	var selected_objects = [];

  for (var i = 0; i < size; i++) {

		field_id = json[i][fieldName];
		if (field_id == idToLookFor) {
			objects = json[i];
			selected_objects.push(objects);
		}

  }
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

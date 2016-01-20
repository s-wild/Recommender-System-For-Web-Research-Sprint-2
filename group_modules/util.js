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

// Gets a objects from within JSON based on id
function findId(json, fieldName, idToLookFor) {
	size = objectLength(json);

  for (var i = 0; i < size; i++) {

		field_id = json[i][fieldName];
		if (field_id == idToLookFor) {
			objects = json[i];
			return objects;

		}

  }

}

// Counts items in objects.
function objectLength(obj) {
  var result = 0;
  for(var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
    // or Object.prototype.hasOwnProperty.call(obj, prop)
      result++;
    }
  }
  return result;
}

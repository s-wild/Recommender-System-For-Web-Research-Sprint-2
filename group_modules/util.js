module.exports = {
	getNestedObject : getNestedObject
}



// Gets a nested object from within JSON
function getNestedObject(json, attrName) {
	for(var attributename in json){
		// If match
    	if (attributename = attrName) {
    		// Retrieve nested object, e.g. object.potato
    		var o = json[attributename];
    		return o;
    	} 
	}

	return undefined;
}


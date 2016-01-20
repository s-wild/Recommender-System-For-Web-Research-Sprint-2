// Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var calc = require('./group_modules/calc.js');

// Data files
var restaurants = require('./data/restaurants.json');
var activities = require('./data/activities.json');
var transport = require('./data/transport.json');

// Routes
app.get('/api/:file', function(req, res) {
	if (req.params.file == 'undefined') {
		res.end("File not recognised.");
		return;
	}
	var file = req.params.file;

	switch(file) {
		case 'restaurants':
			res.end(JSON.stringify(restaurants));
			return;
		case 'activities':
			res.end(JSON.stringify(activities));
			return;
		case 'transport':
			res.end(JSON.stringify(transport));
			return;
		default:
			res.end("File not recognised");
			return;
	}

});

app.get('/api/cheapest/:file', function(req, res) {
	if (req.params.file == 'undefined') {
		res.end("File not recognised.");
		return;
	}

	var file = req.params.file;
	calc.cheapest(file, res);
});


// Start server
var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Recommender System API listening at http://%s:%s", host, port);
});

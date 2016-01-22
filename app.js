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
var users = require('./data/users.json');

// Routes

// GET FILES
app.get('/api/:file', function(req, res) {
	if (typeof(req.params.file) == 'undefined') {
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
		case 'users':
			res.end(JSON.stringify(users));
			return;
		default:
			res.end("File not recognised");
			return;
	}

});

// GET CHEAPEST
app.get('/api/cheapest/:file', function(req, res) {
	if (typeof(req.params.file) == 'undefined') {
		res.end("File not recognised.");
		return;
	}

	var file = req.params.file;
	calc.cheapest(file, res);
});

// GET ENTITY BY SERVICE
app.get('/api/services/:file/:service', function(req, res) {
	if (typeof(req.params.file) == 'undefined' || typeof(req.params.service) == 'undefined') {
		res.end("File not recognised.");
		return;
	}

	var file = req.params.file;
	var service = req.params.service;
	calc.service_match(file, service, res);
});

// GET USER PROFILE
app.get('/api/users/:uid', function(req, res) {
	var uid = req.params.uid;
	calc.users(uid, res);
});

// GET USER ACTIVITY
app.get('/api/users/:uid/:file', function(req, res) {
	var uid = req.params.uid;
	var file = req.params.file;
	var returnResults = calc.userActivity(uid, file, res);
	if (returnResults.length) {
		res.end(JSON.stringify(returnResults));
	}
	else {
		res.end(JSON.stringify("No results found."));
	}
});


// Start server
var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Recommender System API listening at http://%s:%s", host, port);
});

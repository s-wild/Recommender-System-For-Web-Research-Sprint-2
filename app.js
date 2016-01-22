// Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Our modules
var calc = require('./group_modules/calc.js');
var info = require('./group_modules/info.js');
var check = require('./group_modules/check.js');

// Data files
var restaurants = require('./data/restaurants.json');
var activities = require('./data/activities.json');
var transport = require('./data/transport.json');
var users = require('./data/users.json');


var messages = {
	"no_results" : "No results found.",
	"not_recognised" : "File not recognised"
};

// Routes

// GET FILES
app.get('/api/:file', function(req, res) {
	if (!check.isDefined([req.params.file])) {
		res.end(messages.not_recognised);
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
			res.end(messages.not_recognised);
			return;
	}

});

// GET CHEAPEST
app.get('/api/cheapest/:file', function(req, res) {
	if (!check.isDefined([req.params.file])) {
		res.end(messages.not_recognised);
		return;
	}

	var file = req.params.file;
	var cheapest = calc.cheapest(file, res);

	if (cheapest.length) {
		res.end(JSON.stringify(cheapest));
	}

	res.end(messages.not_found);
});

//LIST ALL ENTITIES IN FILE
app.get('/api/services/:file', function(req, res){
	if (!check.isDefined([req.params.file])){
		res.end(messages.not_recognised);
		return;
	}
	var file = req.params.file;
	var entities = info.allEntities(file, res);

	if (entities.length) {
		res.end(JSON.stringify(entities));
	}

	res.end(messages.not_found);
});

// GET ENTITY BY SERVICE
app.get('/api/services/:file/:service', function(req, res) {
	if (!check.isDefined([req.params.file, req.params.service])) {
		res.end(messages.not_recognised);
		return;
	}

	var file = req.params.file;
	var service = req.params.service;
	res.end(JSON.stringify(calc.service_match(file, service, res)));
});

// GET USER PROFILE
app.get('/api/users/:uid', function(req, res) {
	var uid = req.params.uid;
	if (!check.isDefined([uid])) {
		res.end(JSON.stringify(info.getUsers()));
	}

	res.end(JSON.stringify(info.getUser(uid)));
});

// GET USER ACTIVITY
app.get('/api/users/:uid/:file', function(req, res) {
	if (!check.isDefined([req.params.uid, req.params.file])) {
		res.end(messages.not_recognised + " User ID not recognised");
	}

	var uid = req.params.uid;
	var file = req.params.file;

	var returnResults = info.userActivity(uid, file, res);
	if (returnResults.length) {
		res.end(JSON.stringify(returnResults));
	}
	else {
		res.end(JSON.stringify(messages.no_results));
	}
});


// Start server
var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Recommender System API listening at http://%s:%s", host, port);
});

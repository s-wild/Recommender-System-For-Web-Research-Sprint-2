var userInput = "#users";

$(document).ready(function() {

	//Get user history for selected user on page load.
	getUserHistory();

	// Hide word on load.
	$("#wordCloudWrapper").hide();
	$("#sectorButtons").hide();
	$("#keyDescription").hide();

	// Event listeners
	$("#getRecommBtn").click(getRecommendations);

	// If user name is changed, get user history
	$("#users").on("change keyup paste", function(){
		getUserHistory();
	});

	// jQuery smooth scroll.
	$(function() {
	  $('a[href*="#"]:not([href="#"])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html, body').animate({
	          scrollTop: target.offset().top
	        }, 1000);
	        return false;
	      }
	    }
	  });
	});
});



function getRecommendations() {
	var user = $("#users").val();
	var bracket = user.indexOf("(");
	var userId = user.substring(bracket+1, bracket+2);
	var location = $("#locations").val();

	// Send query to URL
	$.ajax({
  		url: "http://localhost:3000/api/recommend/all/" + userId + "/" + location + "/html"
	})
  	.done(function( data ) {
			// Show key
			$("#keyDescription").show();
    	//alert(data);
    	// Put recommendations on page
    	$("#recommendations").html(data);

			// Show cloud and sector buttons when there are recommendations.
			$("#wordCloudWrapper").show();
			$("#sectorButtons").show();

			// Adjust display to show word cloud.
			$("#userSelect").removeClass("offset-l4");
			$("#userSelect").addClass("offset-l2");

  	});
}

function getUserHistory() {
	var user = $("#users").val();
	var bracket = user.indexOf("(");
	var userId = user.substring(bracket+1, bracket+2);
	var location = $("#locations").val();

	// Send query to URL for wordcloud
	$.ajax({
			url: "http://localhost:3000/api/frequencyofkeywords/" + userId
	})
		.done(function( dataWords ) {

			// Parse JSON, seperate by sector.
			var dataWordParse = JSON.parse(dataWords);
			var restaurantsData = dataWordParse.restaurants;
			var activitiesData = dataWordParse.activities;
			var transportData = dataWordParse.transport;

			// Create empty arrays to store values retrived.
			var restaurantsKeywords = [];
			var activitiesKeywords = [];
			var transportKeywords = [];
			var allKeywords = [];

			// Adjusts the font size of word cloud.
			var fontCloudSize = 15;

			// Check there is user history for activities, if so, add values to array.
			if(transportData[0] !== undefined && typeof(transportData[0].no_history) == 'undefined') {
					Object.keys(transportData).forEach(function(key) {
						var wordTransport = transportData[key].word;
						var countTransport = transportData[key].count * fontCloudSize;
						allKeywords.push([wordTransport, countTransport]);
					});
			}
			else {
					console.log("transportData does not exist.");
			}

			// Check there is user history for activities, if so, add values to array.
			if(restaurantsData[0] !== undefined &&  typeof(restaurantsData[0].no_history) == 'undefined') {
					Object.keys(restaurantsData).forEach(function(key) {
						var wordsRestaurant = restaurantsData[key].word;
						var countRestaurant = restaurantsData[key].count * fontCloudSize;
						allKeywords.push([wordsRestaurant, countRestaurant]);
					});
			}
			else {
					console.log("restaurantsData does not exist.");
			}

			// Check there is user history for activities, if so, add values to array.
			if(activitiesData[0] !== undefined && typeof(activitiesData[0].no_history) == 'undefined') {
					Object.keys(activitiesData).forEach(function(key) {
						var wordsActivities = activitiesData[key].word;
						var countActivities = activitiesData[key].count * fontCloudSize;
						allKeywords.push([wordsActivities, countActivities]);
					});
			}
			else {
					console.log("activitiesData does not exist.");
			}

			// Initialise word cloud and assign all keywords that exist.
			WordCloud(document.getElementById('wordCloud'), { list: allKeywords } );
		});
}

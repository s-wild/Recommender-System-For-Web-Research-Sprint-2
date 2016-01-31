var userInput = "#users";

$(document).ready(function() {

	// Event listeners
	$("#getRecommBtn").click(getRecommendations);




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
    	//alert(data);
    	// Put recommendations on page
    	$("#recommendations").html(data);	
  	});
}
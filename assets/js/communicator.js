var userInput = "#users";

$(document).ready(function() {

	// Event listeners
	$("#getRecommBtn").click(getRecommendations);

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
    	//alert(data);
    	// Put recommendations on page
    	$("#recommendations").html(data);
  	});

		// Send query to URL for wordcloud
		$.ajax({
	  		url: "http://localhost:3000/api/frequencyofkeywords/" + userId
		})
	  	.done(function( dataWords ) {
	    	//alert(data);
	    	// Put recommendations on page
	    	$("#wordCloud").html(dataWords);
				console.log("dataWords",dataWords);
				// Sam for some reason, this part does not work even though it matches the one below?
				//WordCloud(document.getElementById('wordCloud'), { list: dataWords } );
				WordCloud(document.getElementById('wordCloud'), { list: [["foo", 12], ["bar", 6], ["bar", 6]] } );
	  	});

}

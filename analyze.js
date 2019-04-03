var subscriptionKey = "bd4f483114c3415ea81a9f17b840ad90";
var uriBase = "https://southeastasia.api.cognitive.microsoft.com/vision/v2.0/analyze";

var params = {
    "visualFeatures": "Description",
    "details": "",
    "language": "en",
};

var sourceImageUrl = "https://marfgold1.blob.core.windows.net/blockblobsjdsfqf/image.jpg";
document.querySelector("#sourceImage").src = sourceImageUrl;

// Make the REST API call.
$.ajax({
	url: uriBase + "?" + $.param(params),

    // Request headers.
    beforeSend: function(xhrObj){
    	xhrObj.setRequestHeader("Content-Type","application/json");
    	xhrObj.setRequestHeader(
    		"Ocp-Apim-Subscription-Key", subscriptionKey);
    },

    type: "POST",

    // Request body.
    data: '{"url": ' + '"' + sourceImageUrl + '"}',
})

.done(function(data) {
    // Show formatted JSON on webpage.
    console.log(data);
    document.querySelector("#captionText").innerText = data.description.captions[0].text;
})

.fail(function(jqXHR, textStatus, errorThrown) {
    // Display error message.
    var errorString = (errorThrown === "") ? "Error. " :
    errorThrown + " (" + jqXHR.status + "): ";
    errorString += (jqXHR.responseText === "") ? "" :
    jQuery.parseJSON(jqXHR.responseText).message;
    document.querySelector("#captionText").innerText = errorString + "\n\nAsk web administrator for fix.";
    alert(errorString);
});
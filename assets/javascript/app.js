//firebase configuration
var config = {
    apiKey: "AIzaSyC88nQOFV_H15tOFBeRz4ChfWvA2-DehF4",
    authDomain: "amazingrebelsproject1.firebaseapp.com",
    databaseURL: "https://amazingrebelsproject1.firebaseio.com",
    projectId: "amazingrebelsproject1",
    storageBucket: "",
    messagingSenderId: "327937749814"
};
firebase.initializeApp(config);

//global vars
var origin;
var fromDT;
var toDT;
var price;
var city;
var stateCode;
var startDateTime;
var endDateTime;
var selectedEvents = [];
var cityCode;
var placesArray = [];
var selectedFlights = [];

//DB refs
var refPlaces = firebase.database().ref("Places");

//functions
function mainFunction() {
    //Remove previous results
    initialization();
    //input collection
    inputCollection();
    //input conversion
    inputConversion();
    //call event API
    skyAPI();
};

function initialization(){
    selectedEvents = [];
    selectedFlights = [];
    $("#results").empty();
}

function inputCollection() {
    //origin place
    origin = $("#origin").val();
    //from date
    fromDT = $("#fromDT").val();
    //to date
    toDT = $("#toDT").val();
    //max price
    price = parseInt($("#price").val());

};

function inputConversion() {
    var cityState = origin.split(",");
    city = cityState[0];
    stateCode = cityState[1];
    startDateTime = fromDT + "T00:00:00Z";
    endDateTime = toDT + "T00:00:00Z"
    var place = $.grep(placesArray, function (n){
        return (n.CityName === city);
    });
    cityCode = place[0].SkyscannerCode;
}

function eventAPI() {
    eventUrl();
    var queryURL = eventUrl();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(filterEvents);
};

function eventUrl() {
    queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?";
    queryParams = {
        "apikey": "RiZRkyV5YlnXPcOPAlrXwWG4IMbwx2n8",
        "countryCode": "US"
    };
    queryParams.stateCode = stateCode;
    queryParams.city = city;
    queryParams.startDateTime = startDateTime;
    queryParams.endDateTime = endDateTime;
    return queryURL + $.param(queryParams);
};

function filterEvents(response) {
    var eventCount = 0;
    if (response._embedded.events.length > 3) {
        eventCount = 3;
    }
    else {
        eventCount = response._embedded.events.length;
    };
    for (var i = 0; i < eventCount; i++) {
        selectedEvents.push({
            "eventName": response._embedded.events[i].name,
            "eventURL": response._embedded.events[i].url
        });
    };
    returnEvents();
};

function returnEvents() {

    var section = $("<section>");
    var divContainer = $("<div>");
    divContainer.attr("class", "container");
    var title = $("<h1>");
    title.attr("class", "title");
    title.html(city + ", " + stateCode);
    var weatherParagraph = $("<p>");
    weatherParagraph.html("It is currently 75°F in " + city);
    var eventsParagraph = $("<p>");
    eventsParagraph.html("Here are some events going on in the area during your visit:");
    divContainer.append(title);
    divContainer.append(weatherParagraph);
    divContainer.append($("<br>"));
    divContainer.append(eventsParagraph);
    
    for (var i = 0; i < selectedEvents.length; i++) {

        var eventButton = $("<button>");
        var eventLink = $("<a>");
        eventLink.text(selectedEvents[i].eventName);
        eventLink.attr("href", selectedEvents[i].eventURL);
        eventLink.attr("target", "_blank");
        eventButton.append(eventLink);
        divContainer.append(eventButton);

    };

    section.append(divContainer);
    $("#results").append(section);
};

function skyAPI() {
    skyUrl();
    var queryURL = skyUrl();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(filterFlights);
};

function skyUrl() {
    queryURL = "http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/usd/en-US/" + cityCode + "/us/" + fromDT + "/" + toDT + "?";
    queryParams = {
        "apikey": "prtl6749387986743898559646983194",
    };
    return queryURL + $.param(queryParams);
};

function filterFlights(response) {
    if (response.Quotes.length === 0) {
        alert("no quote is available at this time!")
    }
    else {
        for (var i=0; i<response.Quotes.length; i++) {
            if(response.Quotes[i].MinPrice <= price){
                var destinationCode = response.Quotes[i].OutboundLeg.DestinationId;
                var place = $.grep(placesArray, function (n){
                    return (n.PlaceId === destinationCode);
                });
                var destinationCity = place[0].CityName;
                selectedFlights.push({
                        "destinationCity": destinationCity,
                        "price": response.Quotes[i].MinPrice
                    }
                )
            }
        }
        returnFlights();
    };
};

function returnFlights() {
    var $section = $("<section>");
    var $divContainer = $("<div>");
    $divContainer.attr("class", "container");
    
    for (var i = 0; i < selectedFlights.length; i++) {
        var $para = $("<p>");
        $para.text(selectedFlights[i].destinationCity + "," + selectedFlights[i].price);
        $divContainer.append($para);
    };

    $section.append($divContainer);
    $("#results").append($section);
};
//script starts
$("#submit").on("click", mainFunction);

refPlaces.once("value", function(snapshot){
    placesArray = snapshot.val();
})

// refPlaces.orderByChild("CityName").equalTo(city).once("value").then(function(snapshot) {
//     var location = snapshot.val();
//     var key = Object.keys(location)[0];
//     cityCode = location[key].SkyscannerCode;
// });



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

//functions
function mainFunction() {
    //Remove previous results
    initialization();
    //input collection
    inputCollection();
    //input conversion
    inputConversion();
    //call event API
    eventAPI();
    //call weather API
    weatherAPI();
};

function initialization(){
    selectedEvents = [];
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
}

function eventAPI() {
    buildUrl();
    var queryURL = buildUrl();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(filterResults);
};

function weatherUrl() {
    return "http://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&apikey=710caaee5eb7962fcebb2ea857da3696";
};

function weatherAPI() {
    weatherUrl();
    var queryURL = weatherUrl();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
    });
};

function buildUrl() {
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

function filterResults(response) {
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
    returnResults();
};

function returnResults() {

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

//script starts
$("#submit").on("click", mainFunction);



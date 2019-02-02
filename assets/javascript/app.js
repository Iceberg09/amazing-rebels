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

//functions
function mainFunction () {
    //input collection
    inputCollection();
    //input conversion
    inputConversion();
    //call event API
    eventAPI();
    //return searched results
    returnResults();
};

function inputCollection() {
    //origin place
    origin = $("#origin").val();
    //from date
    fromDT = $("#fromDT").val();
    //to date
    toDT = $("#toDT").val();
    //max price
    price = parseInt($("#price").text());

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

function buildUrl (){
    queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?";
    queryParams = { "apikey": "RiZRkyV5YlnXPcOPAlrXwWG4IMbwx2n8",
                    "countryCode": "US"};
    queryParams.stateCode = stateCode;
    queryParams.city = city;
    queryParams.startDateTime = startDateTime;
    queryParams.endDateTime = endDateTime;
    return queryURL + $.param(queryParams);
};

function filterResults(response) {

};

function returnResults() {

};

//script starts
$("#submit").on("click", mainFunction);

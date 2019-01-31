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
var destination;

//functions
function mainFunction () {
    inputCollection();
    //get list of desitination from DB;
    getDesitination();
    //call Skyscannner API
    skyAPI();
    //return searched results
    returnResults();
};

function inputCollection() {
    //origin place
    origin = $("#origin").text();
    //from date
    fromDT = $("#fromDT").text();
    //to date
    toDT = $("#toDT").text();
    //price
    price = parseInt($("#price").text());
};

function getDesitination() {

};

function skyAPI() {

};

function returnResults() {

};

//script starts
$("#submit").on("click", mainFunction);

// Initialize Firebase
var config = {
	apiKey: "AIzaSyAk5KDZ9jcAwx20-kcld_FTa_mmgl4vfUM",
	authDomain: "train-scheduler-d5381.firebaseapp.com",
	databaseURL: "https://train-scheduler-d5381.firebaseio.com",
	storageBucket: "train-scheduler-d5381.appspot.com",
	messagingSenderId: "110482573862"
};

firebase.initializeApp(config);

// A variable to reference the database.
var database = firebase.database();

$("#add-train-btn").on("click", function(event){
	event.preventDefault();

	//Grabs user input
	var trainName = $("#train-name-input").val().trim();
	var destinationName = $("#destination-input").val().trim();
	var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").format("X");	
	var frequency = $("#frequency-input").val().trim();

	// Creates local "temporary" object for holding train data

	var newTrain = {
		name: trainName,
		destination: destinationName,
		firstTrain: firstTrain,
		frequency: frequency
	};

	// log new train object to the console 
	console.log(newTrain);
	
	// push the newTrain object to the database 
	database.ref().push(newTrain); 

	// alert("Train successfully added");

	// Clears all of the text-boxes
	$("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");

  // Prevents moving to a new page
  return false;

});


database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // logs the snapshot of the new child added to firebase 	
  console.log(childSnapshot.val());

  // Store the property values into variables 
  var trainName = childSnapshot.val().name;
  var destinationName = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstTrain;
  var frequency = childSnapshot.val().frequency;

  // logs the variables to the console 
  console.log(trainName);
  console.log(destinationName);
  console.log(firstTrain);
  console.log(frequency);

  // gets the current time using moment.js
  var now = moment();
  // logs a formatted version of the current time 
  console.log("The current time is " + moment(now).format("HH:mm"));  

  // formats the first train time value stored in the variable of firstTrain
  var firstTrainTime = moment.unix(firstTrain).format("HH:mm");
  // logs result to the console
  console.log("The first train is at " + firstTrainTime);

  // First Time (pushed back 1 year to make sure it comes before current time) 
  var firstTrainTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
  
  // the difference between time in minutes   
  var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
  
  // the remaining time when time difference is divided by the frequency
  var Remainder = diffTime % frequency;
  
  // the remainder is subtracted from the frequency and stored in minutesAway
  var minutesAway = frequency - Remainder;
  console.log("The next train is " + minutesAway + " minutes away");
  
  // minutesAway is added to the current time and stored in the nextArrival variable 
  var nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");
  console.log("The next train arrives at " + nextArrival);
 
  // When a user submits a new train the information populates the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destinationName + "</td><td>" +
  frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway );
});


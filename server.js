var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var logger = require("morgan");
var mongoose = require("mongoose");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

// Use morgan logger for logging requests
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/public/')));

// If deployed, use the deployed database. Otherwise use the local mongoTechnica database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoTechnica";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  //useMongoClient: true
});

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);

// Routes
var routes = require("./controller/mt_controller.js");
app.use(routes);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
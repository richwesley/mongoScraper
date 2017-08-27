// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");
var methodOverride = require("method-override");
// Requiring models
var Note = require("./models/note.js");
var Article = require("./models/article.js");

// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
mongoose.Promise = Promise;


// Express
var app = express();
var PORT = process.env.PORT || 3000;

//  body parser
app.use(bodyParser.urlencoded({
  extended: false
}));


app.use(methodOverride('_method'));
app.use(express.static("./public"));

var exphbs = require("express-handlebars");
app.set('views', __dirname + '/views');
app.engine("handlebars", exphbs({ defaultLayout: "main", layoutsDir: __dirname + "/views/layouts" }));
app.set("view engine", "handlebars");


var databaseUri = "mongodb://localhost/coopscrape";
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}
var db = mongoose.connection;

/*mongoose.connect("mongodb://heroku_dnbl2f3n:etrnrrvnoe7m1qmtae0jret6ss@ds111882.mlab.com:11882/heroku_dnbl2f3n");
var db = mongoose.connection;*/

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//=========Routes==========//
const routes = require("./routes/routes.js");
app.use("/", routes);

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on PORT" + PORT + "!");
});

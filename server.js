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


// app.get("/", function (req, res) {
//   Article.find({})
//     .exec(function (error, data) {
//       if (error) {
//         res.send(error);
//       }
//       else {
//         var newsObj = {
//           Article: data
//         };
//         res.render("index", newsObj);
//       }
//     });
// });

// // A GET request to scrape the website
// app.get("/scrape", function(req, res) {
 
//   request("http://www.alicecooper.com/", function(error, response, html) {
    
//     var $ = cheerio.load(html);
   
//     $("h2.su-post-title").each(function(i, element) {

     
//       var result = {};

     
//       result.title = $(this).text();
//       result.img = $(this).attr("src");
//       result.link = $(this).children().first().attr("href");

      
//       var entry = new Article(result);

    
//       entry.save(function(err, doc) {
      
//         if (err) {
//           console.log(err);
//         }
        
//         else {
//           console.log(doc);
//         }
//       });

//     });
//     res.redirect("/");
//     console.log("Successfully Scraped");
//   });
// });

// app.post("/notes/:id", function (req, res) {
//   var newNote = new Note(req.body);
//   newNote.save(function (error, doc) {
//     if (error) {
//       console.log(error);
//     }
//     else {
//       console.log("this is the DOC " + doc);
//       Article.findOneAndUpdate({
//         "_id": req.params.id
//       },
//         { $push: { "note": doc._id } }, {new: true},  function (err, doc) {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log("note saved: " + doc);
//             res.redirect("/notes/" + req.params.id);
//           }
//         });
//     }
//   });
// });

// app.get("/notes/:id", function (req, res) {
//   console.log("This is the req.params: " + req.params.id);
//   Article.find({
//     "_id": req.params.id
//   }).populate("note")
//     .exec(function (error, doc) {
//       if (error) {
//         console.log(error);
//       }
//       else {
//         var notesObj = {
//           Article: doc
//         };
//         console.log(notesObj);
//         res.render("notes", notesObj);
//       }
//     });
// });

// app.get("/delete/:id", function (req, res) {
//   Note.remove({
//     "_id":req.params.id
//   }).exec(function (error, doc) {
//     if (error) {
//       console.log(error);
//     }
//     else {
//       console.log("note deleted");
//       res.redirect("/" );
//     }
//   });
// });

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on PORT" + PORT + "!");
});

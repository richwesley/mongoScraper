var Note = require("../models/note.js");
var Article = require("../models/article.js");
const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  Article.find({})
    .exec(function (error, data) {
      if (error) {
        res.send(error);
      }
      else {
        var newsObj = {
          Article: data
        };
        res.render("index", newsObj);
      }
    });
});

// A GET request to scrape the website
router.get("/scrape", function(req, res) {
 
  request("http://www.alicecooper.com/", function(error, response, html) {
    
    var $ = cheerio.load(html);
   
    $("h2.su-post-title").each(function(i, element) {

     
      var result = {};

     
      result.title = $(this).text();
      result.img = $(this).attr("src");
      result.link = $(this).children().first().attr("href");

      
      var entry = new Article(result);

    
      entry.save(function(err, doc) {
      
        if (err) {
          console.log(err);
        }
        
        else {
          console.log(doc);
        }
      });

    });
    res.redirect("/");
    console.log("Successfully Scraped");
  });
});

router.post("/notes/:id", function (req, res) {
  var newNote = new Note(req.body);
  newNote.save(function (error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      console.log("this is the DOC " + doc);
      Article.findOneAndUpdate({
        "_id": req.params.id
      },
        { $push: { "note": doc._id } }, {new: true},  function (err, doc) {
          if (err) {
            console.log(err);
          } else {
            console.log("note saved: " + doc);
            res.redirect("/notes/" + req.params.id);
          }
        });
    }
  });
});

router.get("/notes/:id", function (req, res) {
  console.log("This is the req.params: " + req.params.id);
  Article.find({
    "_id": req.params.id
  }).populate("note")
    .exec(function (error, doc) {
      if (error) {
        console.log(error);
      }
      else {
        var notesObj = {
          Article: doc
        };
        console.log(notesObj);
        res.render("notes", notesObj);
      }
    });
});

router.get("/delete/:id", function (req, res) {
  Note.remove({
    "_id":req.params.id
  }).exec(function (error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      console.log("note deleted");
      res.redirect("/" );
    }
  });
});

module.exports = router;

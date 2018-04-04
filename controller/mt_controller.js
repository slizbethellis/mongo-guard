var express = require("express");
var router = express.Router();
var path = require("path");
var mongoose = require("mongoose");
var moment = require("moment");

// mongo-technica model
var db = require("../models");

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// A GET route for scraping the Ars Technica website
router.get("/scrape", function (req, res) {
  axios.get("https://arstechnica.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    $("article h2").each(function (i, element) {
      // Save an empty result object
      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.summary = $(this).siblings(".excerpt").text();
      result.postDate = moment($(this).siblings(".byline").children("time").attr("datetime"));

      // Create a new Article using the `result` object built from scraping
      db.Article
        .findOne({ title: result.title })
        .then(function (dbEntry) {
          if (dbEntry === null) {
            return db.Article
              .create(result)
              .then(function (dbArticle) {
                // If we were able to successfully scrape and save an Article, send a message to the client
                res.send("Scrape Complete");
              })
              .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
              });
          }
          else {
            return res.send("No new articles");
          }
        });
    });
  });
});

// Route for getting all articles from the db
router.get("/", function (req, res) {
  db.Article
    .find({}, null, { sort: { postDate: -1 } })
    .then(function (dbArticle) {
      var hbObject = {
        Articles: dbArticle
      };
      res.render("index", hbObject);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all articles with comments
router.get("/comments", function (req, res) {
  db.Article
    .find({}).
    where("notes").exists().ne(null).
    limit(20).
    sort({ postDate: -1 })
    .then(function (dbArticle) {
      if (dbArticle === null) {
        res.render("index");
      }
      else {
        var hbObject = {
          Articles: dbArticle
        };
        res.render("index", hbObject);
      }
    })
    .catch(function (err) {
      res.json(err);
    })
});

// Route for grabbing a specific article by id, populate it with its note
router.get("/articles/:id", function (req, res) {
  db.Article
    .findOne({ _id: req.params.id })
    .populate("notes")
    .exec(function (err, doc) {
      if (err) {
        res.json(err);
      }
      else {
        var hbObject = {
          Articles: doc
        };
        res.render("article", hbObject);
      }
    });
});

// Route for saving/updating an article's associated note
router.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note
    .create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { 'notes': dbNote._id } }, { new: true });
    })
    .then(function (dbArticle) {
      var hbObject = {
        Articles: dbArticle
      };
      res.render("article", hbObject);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.post("/articles/:id/deleteNote/:sid", function (req, res) {
  db.Note
    .findByIdAndRemove({_id: req.params.sid}, function (error, doc) {
      res.redirect("back");
    })
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $pull: { 'notes': req.params.sid }});
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

module.exports = router;
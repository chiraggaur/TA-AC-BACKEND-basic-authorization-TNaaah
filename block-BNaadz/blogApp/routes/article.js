var express = require("express");
var router = express.Router();
var Article = require("../models/articles");
var comments = require("../models/comments");
var auth = require("../middlewares/auth");

/* GET users listing. */
// get article form
router.get("/", auth.loggedInUser, function (req, res, next) {
  res.render("articleForm");
});
// post artciles to data base
router.post("/new", function (req, res, next) {
  Article.create(req.body);
  res.redirect("/");
});
// get articles listing
router.get("/list", async function (req, res, next) {
  var data = await Article.find({});
  res.render("articles", { articleData: data });
});
// article details with  with id
router.get("/list/:id", function (req, res, next) {
  var id = req.params.id;
  Article.findById(id).then((article) => {
    comments.find({ articleId: id }).then((comment) => {
      // doubt
      res.render("uniqueArticles", {
        article,
        comment,
      });
    });
  });
  res.render("uniqueArticles", {});
});

// user comments routes

router.post("/:id/comment", function (req, res, next) {
  var id = req.params.id;
  req.body.articleId = id;
  comments.create(req.body).then((comment) => {
    try {
      console.log(comment);
      res.redirect("/article/list/" + id);
    } catch (err) {
      return next(err);
    }
  });
});

module.exports = router;

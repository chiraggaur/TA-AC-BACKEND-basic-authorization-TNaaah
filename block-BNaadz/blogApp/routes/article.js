var express = require("express");
var router = express.Router();
var Article = require("../models/articles");
var comments = require("../models/comments");
var auth = require("../middlewares/auth");
var User = require("../models/users");

/* GET users listing. */
// get article form
router.get("/", auth.isUserLogged, function (req, res, next) {
  res.render("articleForm");
});
// post artciles to data base
router.post("/new", auth.isUserLogged, function (req, res, next) {
  req.body.author = req.session.userId;
  Article.create(req.body);
  res.redirect("/article/list");
});
// get articles listing
router.get("/list", async function (req, res, next) {
  var data = await Article.find({});
  res.render("articles", { articleData: data });
});

// article details with  with id
router.get("/list/:id", async function (req, res, next) {
  var id = req.params.id;
  var articleData = await Article.findById(id).populate(
    "author",
    "firstname lastname"
  );
  // .then((res) => {
  //   console.log(res);
  // })
  // .catch((err) => {
  //   console.log(err);
  // });
  var commentsData = await comments.find({ articleId: id });
  res.render("uniqueArticles", {
    article: articleData,
    comments: commentsData,
  });
  // different set of code  below
  // var articleData = await Article.findById(id);
  // var commentsData = await comments.find({ articleId: id });
  // res.render("uniqueArticles", {
  //   article: articleData,
  //   comments: commentsData,
  // });
});

// user comments routes

router.post("/:id/comment", function (req, res, next) {
  var id = req.params.id;
  req.body.articleId = id;
  comments.create(req.body).then((comment) => {
    try {
      if (comment) {
        res.redirect("/article/list/" + id);
      } else {
        res.render("something went wrong");
      }
    } catch (err) {
      return next(err);
    }
  });
});

module.exports = router;

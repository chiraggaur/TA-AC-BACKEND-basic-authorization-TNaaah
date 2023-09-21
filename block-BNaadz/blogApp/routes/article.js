var express = require("express");
var router = express.Router();
var Article = require("../models/articles");
var comments = require("../models/comments");
var auth = require("../middlewares/auth");
var users = require("../models/users");

/* GET users listing. */
// get article form
router.get("/", auth.isUserLogged, function (req, res, next) {
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
router.get("/list/:id", async function (req, res, next) {
  var id = req.params.id;
  var articleData = await Article.findById(id);
  var commentsData = await comments.find({ articleId: id });
  var commentsData = await users.find({ userId: id });
  res.render("uniqueArticles", {
    article: articleData,
    comments: commentsData,
  });
});

// user comments routes

router.post("/:id/comment", auth.isUserLogged, function (req, res, next) {
  var id = req.params.id;
  req.body.articleId = id;
  comments.create(req.body).then((comment) => {
    try {
      // console.log(comment);
      res.redirect("/article/list/" + id);
    } catch (err) {
      return next(err);
    }
  });
});

// my articles list

router.get(
  "/list/:id/myarticles",
  auth.isUserLogged,
  async function (req, res, next) {
    var id = req.params.id;
    var articleData = await Article.findById(id);
    var commentsData = await comments.find({ articleId: id });

    res.render("uniqueArticles", {
      article: articleData,
      comments: commentsData,
    });
  }
);

module.exports = router;

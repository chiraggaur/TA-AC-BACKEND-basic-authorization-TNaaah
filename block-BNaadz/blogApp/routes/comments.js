var express = require("express");
var router = express.Router();
var Article = require("../models/articles");
var comments = require("../models/comments");
var auth = require("../middlewares/auth");

/* GET users listing. */
// get article form

router.get("/:id/edit", async function (req, res, next) {
  var id = req.params.id;
  var comment = await comments.findById(id);
  res.render("commentsForm", { comment });
});

router.post("/:id", async function (req, res, next) {
  var id = req.params.id;

  try {
    await comments.findByIdAndUpdate(id, req.body).then((updatedcomment) => {
      res.redirect("/article/list/" + updatedcomment.articleId);
    });
  } catch (err) {
    next(err);
  }
});

// delete comment
router.get("/:id/delete", async function (req, res, next) {
  var id = req.params.id;
  var comment = await comments.findByIdAndRemove(id).then((updatedComment) => {
    res.redirect("/article/list/" + updatedComment.articleId);
  });
});

module.exports = router;

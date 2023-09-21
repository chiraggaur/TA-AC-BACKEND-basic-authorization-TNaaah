var express = require("express");
var router = express.Router();
var User = require("../models/users");
var bcrypt = require("bcrypt");

/* GET users listing. */
// get registration form
router.get("/", function (req, res, next) {
  // console.log(req.session);
  res.render("registerForm");
});
// create new user  to data base
router.post("/new", async function (req, res, next) {
  // unique email only
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      res.redirect("/users/register");
    } else {
      User.create(req.body);
      res.redirect("/users/loginForm");
    }
  } catch (err) {
    next(err);
  }
});
// login form redirect
router.get("/login", function (req, res, next) {
  res.render("loginForm");
});
// login form details to verify use with database
router.post("/login", function (req, res, next) {
  var { email, password } = req.body;
  //   console.log(username, password);
  if (!email || !password) {
    res.redirect("/users/login");
  }
  try {
    User.findOne({ email }).then((user) => {
      if (!user) {
        res.redirect("/users/login");
      }
      // compare password

      user.verifypassword(password, (err, result) => {
        if (err) return next(err);
        if (!result) {
          res.redirect("/users/login");
        }
        // persist user logged in information
        req.session.userId = user._id;
        res.redirect("/article/list");
      });
    });
  } catch (error) {
    return next(err);
  }
});

// user comments routes

router.post("/:id/comments", async function (req, res, next) {
  // unique email only
});

module.exports = router;

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var session = require("express-session");
const MongoStore = require("connect-mongo");
var auth = require("./middlewares/auth");
var indexRouter = require("./routes/index");
var articleRouter = require("./routes/article");
var usersRouter = require("./routes/users");
var commentsRouter = require("./routes/comments");

// connect mongoose  to db before get request from app;

mongoose.connect("mongodb://127.0.0.1:27017/blogApp");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// add session

app.use(
  session({
    secret: "somerandomsesssion",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create(mongoose.connection),
  })
);
// user info check
app.use(auth.userInfo);
//routes
app.use("/", indexRouter);
app.use("/article", articleRouter);
app.use("/users", usersRouter);
app.use("/comments", commentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

var User = require("../models/users");
module.exports = {
  isUserLogged: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.redirect("/users/login");
    }
  },

  userInfo: async (req, res, next) => {
    var userId = req.session && req.session.userId;
    if (userId) {
      await User.findById(userId).then((user) => {
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
};

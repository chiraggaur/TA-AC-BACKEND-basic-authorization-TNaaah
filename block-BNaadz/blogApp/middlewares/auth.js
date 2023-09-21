module.exports = {
  isUserLogged: (req, res, next) => {
    if (req.sessions && req.sessions.userId) {
      next();
    } else {
      res.redirect("/users/login");
    }
  },
};

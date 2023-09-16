const passport = require("passport");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (!user || error) {
      return res.status(401).json({ status: "Unauthorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

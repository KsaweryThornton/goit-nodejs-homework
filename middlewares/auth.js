const passport = require("passport");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    const token = req.header("authorization").split(" ")[1];
    if (!user || error || !token || token !== user.token) {
      return res.status(401).json({
        data: "Unauthorized",
        status: "error",
        code: 401,
        message: "Unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

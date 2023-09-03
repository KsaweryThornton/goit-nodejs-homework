const passport = require("passport");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    const tokenFromRequest = req.body.token;
    if (!user || tokenFromRequest !== user.token || error) {
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

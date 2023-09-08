const passport = require("passport");
const User = require("../service/schemas/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      const unauthorizedError = {
        status: 401,
        message: "Not authorized",
      };
      return res.status(401).json(unauthorizedError);
    }

    req.user = user;
    next();
  })(req, res, next);
};

passport.use(
  new JwtStrategy(options, async (req, jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      let token = req.headers.authorization;
      token = token.substring(7);

      console.log(token);
      if (!user || user.token !== token) {
        const unauthorizedError = {
          status: 401,
          message: "Not authorized",
        };
        return done(unauthorizedError, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = authMiddleware;

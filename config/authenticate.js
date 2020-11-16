const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const keys = require("./secret");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretKey,
};

exports.getToken = function (user) {
  return jwt.sign(user, keys.secretKey, { expiresIn: 3600 });
};

exports.localPassport = passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      User.findOne({ email }, async (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(new Error("Email not registered"));
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(new Error("Incorrect password"));
        }
        return done(null, user);
      });
    }
  )
);

exports.jwtPassport = passport.use(
  new JwtStrategy(options, (jwt_payload, done) => {
    User.findById(jwt_payload._id, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });
exports.verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin === false) return res.status(401).send("Unauthorised");
  else next();
};

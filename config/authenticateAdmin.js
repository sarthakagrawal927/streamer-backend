const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Admin = require("../models/admin");
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
  "local admin",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      Admin.findOne({ email }, async (err, admin) => {
        if (err) {
          return done(err);
        }

        if (!admin) {
          return done(new Error("Email not registered"));
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
          return done(new Error("Incorrect password"));
        }
        return done(null, admin);
      });
    }
  )
);

exports.jwtPassport = passport.use(
  "jwt admin",
  new JwtStrategy(options, (jwt_payload, done) => {
    Admin.findById(jwt_payload._id, (err, admin) => {
      if (err) {
        return done(err, false);
      }
      if (admin) {
        return done(null, admin);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyAdmin = passport.authenticate("jwt admin", { session: false });

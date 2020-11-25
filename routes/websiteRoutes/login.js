const express = require("express");
const passport = require("passport");
const authenticate = require("../../config/authenticateAdmin");

const { check, validationResult } = require("express-validator");

const router = express.Router();

router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters",
    ).isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({
        success: false,
        errors: errors.array().map((error) => {
          return error.msg;
        }),
      });
    }
    passport.authenticate("local admin", (err, admin, info) => {
      try {
        if (err) {
          console.log(err);
          return res
            .status(400)
            .json({ success: false, errors: [err.message] });
        }

        req.login(admin, { session: false }, (err) => {
          if (err)
            return res.status(400).json({ success: false, errors: [err] });

          const body = { _id: admin._id, email: admin.email };
          const token = authenticate.getToken(body);

          return res.json({
            success: true,
            isSuperAdmin: admin.isSuperAdmin,
            college: admin.college,
            token: token,
          });
        });
      } catch (err) {
        return res.status(400).json({ success: false, errors: [err] });
      }
    })(req, res, next);
  },
);

module.exports = router;

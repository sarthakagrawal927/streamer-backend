const express = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("college", "college is required").not().isEmpty(),
    check("phone", "phone number should be 10 digits").isLength(10),
    check(
      "password",
      "Please enter a password with 6 or more characters",
    ).isLength({ min: 6 }),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("passwords don't match");
      }
      return true;
    }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((error) => {
          return error.msg;
        }),
      });
    }

    const { name, email, college, phone, password, regNo } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ success: false, errors: ["Email is already used"] });
      }

      user = new User({
        name,
        email,
        phone,
        college,
        password,
        regNo,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      return res.json({ success: true });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success: false, erros: ["server error"] });
    }
  },
);

module.exports = router;

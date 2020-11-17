const express = require("express");
const { check, validationResult } = require("express-validator");
const Admin = require("../../models/admin");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
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

    const { name, email, college, password } = req.body;

    try {
      let admin = await Admin.findOne({ email });
      if (admin) {
        return res
          .status(400)
          .json({ success: false, errors: ["Email is already used"] });
      }

      admin = new Admin({
        name,
        email,
        college,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);

      await admin.save();
      return res.json({ success: true });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success: false, erros: ["server error"] });
    }
  }
);

module.exports = router;

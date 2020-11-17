const express = require("express");
const router = express.Router();

const authenticate = require("../../config/authenticate");
const User = require("../../models/user");

router.get(
  "/",
  // authenticate.verifyUser,
  // authenticate.verifyAdmin,
  async (req, res, next) => {
    const users = await User.find({ isAdmin: false }).select("-isAdmin");
    res.json(users);
  },
);

module.exports = router;

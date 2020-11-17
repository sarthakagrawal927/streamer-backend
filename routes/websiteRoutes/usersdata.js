const express = require("express");
const router = express.Router();

const authenticate = require("../../config/authenticateAdmin");

router.get("/", authenticate.verifyAdmin, async (req, res, next) => {
  if (req.user.isSuperAdmin === true) {
    const users = await User.find({});
    return res.json(users);
  } else {
    const college = req.user.college;
    const users = await User.find({ college: college });
    return res.json(users);
  }
});

module.exports = router;

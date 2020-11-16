const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("not supported");
});

router.use("/api/user/register", require("../routes/users/register"));
router.use("/api/user/login", require("../routes/users/login"));

module.exports = router;

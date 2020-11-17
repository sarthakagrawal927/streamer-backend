const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("not supported");
});

router.use("/api/users/register", require("../routes/appRoutes/register"));
router.use("/api/users/login", require("../routes/appRoutes/login"));

router.use("/api/admins/register", require("../routes/websiteRoutes/register"));
router.use("/api/admins/login", require("../routes/websiteRoutes/login"));
router.use("/api/usersdata", require("../routes/websiteRoutes/usersdata"));

module.exports = router;

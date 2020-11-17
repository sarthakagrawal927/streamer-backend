const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("not supported");
});

router.use("/api/user/register", require("../routes/appRoutes/register"));
router.use("/api/user/login", require("../routes/appRoutes/login"));

router.use("/api/admin/login", require("../routes/appRoutes/login"));
router.use("/api/usersdata", require("../routes/websiteRoutes/usersdata"));

module.exports = router;

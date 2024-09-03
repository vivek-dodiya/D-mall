const express = require("express");
const router = express.Router();
const { registerUser, LoginUser ,UserProfile } = require("../controllers/authController");

router.get("/", (req, res) => {
  res.send("this is userRoutes");
});

router.post("/register", registerUser);

router.post("/login", LoginUser);

module.exports = router;

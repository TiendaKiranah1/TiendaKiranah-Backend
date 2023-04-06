const express = require("express");

const router = express.Router();

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/api/v1/users");
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  res.send("Welcome to your dashboard " + req.user.name);
});

module.exports = router;

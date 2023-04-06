const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const facebookSetup = require("../util/socials/facebookAuth");

const router = express.Router();

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/redirect",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/api/v1/users/"
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    return res.redirect("/profile");
  }
);

module.exports = router;

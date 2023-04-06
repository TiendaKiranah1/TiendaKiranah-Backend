const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const googleSetup = require("../util/socials/googleAuth");

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/users/auth/login"
  }),
  function (req, res) {
    res.redirect("/profile");
  }
);

module.exports = router;

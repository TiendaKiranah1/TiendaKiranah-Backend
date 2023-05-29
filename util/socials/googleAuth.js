const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const User = require("../../models/googleModel");
dotenv.config({ path: "../../config.env" });

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT
    },
    async function (accessToken, refreshToken, profile, done) {
      let user = await User.findOne({
        googleId: profile.id
      });
      if (user) {
        return done(null, user);
      }
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName
        });
        return done(null, user);
      }
    }
  )
);

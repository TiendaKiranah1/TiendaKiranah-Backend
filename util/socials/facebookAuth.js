const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const dotenv = require("dotenv");
const User = require("../../models/facebookModel");
dotenv.config({ path: "./config.env" });

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: process.env.FACEBOOK_REDIRECT
    },
    async function (accessToken, refreshToken, profile, done) {
      let user = await User.findOne({ facebookId: profile.id });
      if (user) {
        user.at = accessToken;
        return done(null, user);
      }
      if (!user) {
        user = await User.create({
          facebookId: profile.id,
          name: profile.displayName,
          at: accessToken
        });
        return done(null, user);
      }
    }
  )
);

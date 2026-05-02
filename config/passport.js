const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    let existingUser = await User.findOne({ email });

    // EXISTING USER
    if (existingUser) {
      return done(null, existingUser, { isNewUser: false });
    }

    // NEW USER
    let newUser = new User({
      email: email,
      username: profile.displayName.replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 1000),
      googleId: profile.id,
      passwordSet: false
    });

    await newUser.save();

    return done(null, newUser, { isNewUser: true });

  } catch (err) {
    return done(err, null);
  }
}));

// SERIALIZE
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// DESERIALIZE
passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
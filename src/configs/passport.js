const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); 
const mongoose = require("mongoose");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://zomi-task-nodejs-three.vercel.app/user/login/google/callback'
    // callbackURL: 'http://localhost:3000/user/login/google/callback'

    
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {

    const id = new mongoose.Types.ObjectId();


        user = new User({
          _id: id,
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          authenticationType: 'google'
        });
        await user.save();
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
const express = require("express");
const router = express.Router();
const passport = require('passport');

const UserController = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');

router.post("/signup", UserController.signup);

router.post("/login", UserController.login);


// Auth with Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google auth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  }
);

router.post('/renew_token', UserController.renew_token);

router.delete("/", checkAuth, UserController.delete_user);

module.exports = router;

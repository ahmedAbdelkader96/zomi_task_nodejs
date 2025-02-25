const express = require("express");
const router = express.Router();
const passport = require('passport');

const UserController = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');

router.post("/signup", UserController.signup);

router.post("/login", UserController.login);


router.get('/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/login/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

router.post('/renew_token', UserController.renew_token);

router.delete("/", checkAuth, UserController.delete_user);

module.exports = router;

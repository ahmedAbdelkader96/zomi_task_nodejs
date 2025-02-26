const express = require("express");
const router = express.Router();
const passport = require('passport');
const app = express();

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
    // Print Google account details
    res.status(200).json({
      googleId: req.user.googleId,
      displayName: req.user.name,
      email: req.user.email
    });
  }
);

router.post('/renew_token', UserController.renew_token);

router.delete("/", checkAuth, UserController.delete_user);

module.exports = router;

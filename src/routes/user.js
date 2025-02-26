const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");

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

  const token = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "7d" }
    );
    
    res.status(200).json({
      googleId: req.user.googleId,
      displayName: req.user.name,
      email: req.user.email,
      token:token,
      refreshToken:refreshToken
      
    });
  }
);

router.post('/renew_token', UserController.renew_token);

router.delete("/", checkAuth, UserController.delete_user);

module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");
const User = require('../models/user'); 

const app = express();

const UserController = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');



router.get("/", UserController.get_user);


router.post("/signup", UserController.signup);

router.post("/login", UserController.login);


router.get('/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/login/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const email = req.user.email; 
    const name = req.user.name;
    const googleId = req.user.googleId;
    const id = req.user.id;
    

  const token = jwt.sign(
      { email: email, userId: id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { email: email, userId: id },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "7d" }
    );
    

    const user = new User({
      _id: id,
      email: email,
      name: name,
      googleId: googleId,
      authenticationType: 'google',
      createdAt	: new Date(),  
    });

    // res.status(200).json({
    //   user:user,
    //   token:token,
    //   refreshToken:refreshToken
      
    // });

 
    res.redirect(`zomi://login?id=${id}&token=${token}&refreshToken=${refreshToken}`);


  }
);

router.post('/renew_token', UserController.renew_token);

router.delete("/",  UserController.delete_user);

module.exports = router;

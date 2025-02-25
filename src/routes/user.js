const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');

router.post("/signup", UserController.signup);

router.post("/login", UserController.login);



router.post('/renew_token', UserController.renew_token);

router.delete("/", checkAuth, UserController.delete_user);

module.exports = router;

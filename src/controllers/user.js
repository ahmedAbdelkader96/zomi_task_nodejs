const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[0-9]{6})(?=.*[a-zA-Z]{3}).{9,}$/;

async function get_user(req, res, next) {
  const id = req.params.id;

  // if (!id) {
  //   return res.status(400).json({ message: "ID parameter is required" });
  // }

  User.findById(id).select('-password')
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(400)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err });
    });
}

async function sign_google(req, res, next) {
  try {
    const { name, email, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    const user = await User.findOne({ email: email }).exec();

    if (user) {

    const userObject = user.toObject();
    delete userObject.password;

      const token = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "7d" }
      );

      return res
        .status(200)
        .json({ isNew:false, user: userObject, token: token, refreshToken: refreshToken });
    } else {
      const id = new mongoose.Types.ObjectId();

      newUser = new User({
        _id: id,
        googleId: googleId,
        email: email,
        name: name,
        authenticationType: "google",
      });
      const result = await newUser.save();


      const userObject = newUser.toObject();
      delete userObject.password;

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
      return res
        .status(200)
        .json({isNew:true, user: userObject, token: token, refreshToken: refreshToken });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
}

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Validate email and password

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least 6 numbers and 3 letters",
      });
    }

    const existingUser = await User.findOne({ email: email }).exec();
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const id = new mongoose.Types.ObjectId();

    const user = new User({
      _id: id,
      email: email,
      password: hash,
      name: name,
      authenticationType: 'email',
    });

    const result = await user.save();

    const userObject = result.toObject();
    delete userObject.password;



    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "User Created successfully",
      user: userObject,
      token: token,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least 6 numbers and 3 letters",
      });
    }

    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return res
        .status(400)
        .json({ message: "No account is linked to this email" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Password is incorrect !" });
    }

    const userObject = user.toObject();
    delete userObject.password;

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Auth successful",
      user: userObject,
      token: token,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
}

async function renew_token(req, res, next) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

    // const email = decoded.email;
    // const id = decoded.userId;

    const newToken = jwt.sign(
      { email: decoded.email, userId: decoded.userId },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    const newRefreshToken = jwt.sign(
      { email: decoded.email, id: decoded.userId },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Token renewed",
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Auth failed" });
  }
}

async function delete_user(req, res, next) {
  try {
    const id = req.params.id;

    // if (!id) {
    //   return res.status(400).json({ message: "UserId is required" });
    // }

    const result = await User.deleteOne({ _id: id }).exec();
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "User deleted" });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
}

module.exports = {
  get_user,
  sign_google,
  signup,
  login,
  renew_token,
  delete_user,
};

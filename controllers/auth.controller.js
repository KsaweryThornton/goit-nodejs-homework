const fs = require("node:fs").promises;
const path = require("path");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user.model");
const { updateAvatar } = require("../service/auth.service");
const { send } = require("../service/email.service");

const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({
      status: "Conflict",
      message: "Email is already in use.",
    });
  }
  try {
    const avatarUrl = gravatar.url(email, { s: "250" });
    const newUser = new User({
      username,
      email,
      avatarUrl: avatarUrl,
      verificationToken: uuidv4(),
    });
    newUser.setPassword(password);
    await newUser.save();
    await send(newUser);
    res.status(201).json({
      status: "Created",
      message: "Registration successful. Mail sent to your email address.",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad request",
      message: "Registration wasn't successful. Failed to sent an email",
    });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.validPassword(password)) {
      return res.status(400).json({
        status: "Bad request",
        message: "Incorrect login or password.",
      });
    }
    const payload = {
      id: user.id,
      username: user.username,
    };
    const secret = process.env.SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    res.status(200).json({
      status: "OK",
      data: {
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      error: "Unknown error occurred.",
      message: error.message,
    });
  }
};

const signOut = async (req, res) => {
  try {
    const token = null;
    res.status(204).json({
      status: "No Content",
      message: "You have been logged out.",
      data: {
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      error: "Unknown error occurred.",
      message: error.message,
    });
  }
};

const userList = async (req, res) => {
  try {
    const { username } = req.user;
    res.status(200).json({
      status: "OK",
      message: `Authorization was successful: ${username}`,
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      error: "Unknown error occurred.",
      message: error.message,
    });
  }
};

const updatedAvatar = async (req, res, next) => {
  try {
    const { email } = req.body;
    const image = await Jimp.read(req.file.path);
    await image.resize(250, 250).write(req.file.path);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const newFilename = uniqueSuffix + path.extname(req.file.originalname);
    const newPath = `public/avatars/${newFilename}`;
    await fs.rename(req.file.path, newPath);
    await updateAvatar(email, newPath);
    return res.status(200).json({
      status: "OK",
      message: "Avatar updated successfully.",
      data: {
        avatar: newPath,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signIn,
  signOut,
  signUp,
  userList,
  updatedAvatar,
};

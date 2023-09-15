const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const fs = require("node:fs").promises;
const path = require("path");
const { updateAvatar } = require("../service/auth.service");

const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({
      data: "Conflict",
      status: "error",
      code: 409,
      message: "Email is already in use.",
    });
  }
  try {
    const avatarUrl = gravatar.url(email, { s: "250" });
    const newUser = new User({ username, email, avatarUrl: avatarUrl });
    newUser.setPassword(password);
    await newUser.save();
    console.log(newUser);
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful.",
      },
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      data: "Bad request",
      status: "error",
      code: 400,
      message: "Incorrect login or password.",
    });
  }
  const payload = {
    id: user.id,
    username: user.username,
  };
  const secret = process.env.SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const signOut = async (req, res) => {
  const token = null;
  res.json({
    status: "success",
    code: 204,
    message: "You have been logged out.",
    data: {
      token,
    },
  });
};

const userList = async (req, res) => {
  const { username } = req.user;
  res.json({
    status: "success",
    code: 200,
    data: {
      message: `Authorization was successful: ${username}`,
    },
  });
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
      status: "success",
      code: 200,
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

const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

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
    const newUser = new User({ username, email });
    newUser.setPassword(password);
    await newUser.save();
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

module.exports = {
  signIn,
  signOut,
  signUp,
  userList,
};

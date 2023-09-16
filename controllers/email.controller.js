const User = require("../models/user.model");
const { send } = require("../service/email.service");

const verify = async (req, res) => {
  try {
    const { verificationToken } = req.user;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found.",
      });
    }
    if (user.verify === true) {
      return res.status(400).json({
        status: "Bad request",
        message: "Verification has already been passed.",
      });
    }
    user.verify = true;
    await user.save();
    res.status(200).json({
      status: "OK",
      message: "Verification successful.",
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      error: "Unknown error occurred.",
      message: error.message,
    });
  }
};

const secondVerify = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: "Bad request",
        message: "Missing required field email.",
      });
    }
    const user = await User.findOne({ email });
    if (user.verify === true) {
      return res.status(400).json({
        status: "Bad request",
        message: "Verification has already been passed.",
      });
    }
    await send(user);
    return res.status(200).json({
      status: "OK",
      message: "Verification email sent.",
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      error: "Unknown error occurred.",
      message: error.message,
    });
  }
};

module.exports = {
  verify,
  secondVerify,
};

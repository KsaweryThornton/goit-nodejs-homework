const User = require("../models/user.model");

const updateAvatar = async (userEmail, newUserAvatar) => {
  return User.findOneAndUpdate(
    { email: userEmail },
    { avatarUrl: newUserAvatar },
    { new: true }
  );
};

module.exports = {
  updateAvatar,
};

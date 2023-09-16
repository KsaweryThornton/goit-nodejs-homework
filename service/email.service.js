const nodemailer = require("nodemailer");
require("dotenv").config();

const config = {
  pool: true,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const send = async (user) => {
  const transporter = nodemailer.createTransport(config);
  const verificationLink = `http://localhost:3000/api/auth/users/verify/${user.verificationToken}`;

  const emailOptions = {
    from: process.env.MAIL_USER,
    to: user.email,
    subject: "Confirm your registration",
    html: `Click <a href="${verificationLink}">HERE</a> and confirm your registration.`,
  };
  return await transporter.sendMail(emailOptions).then();
};

module.exports = {
  send,
};

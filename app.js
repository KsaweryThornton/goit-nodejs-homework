const express = require("express");
const app = express();

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");
const emailRouter = require("./routes/api/email");

app.use(express.json());
require("./config/passport");
app.use(express.static('./public/avatars'));



app.use("/api/contacts", contactsRouter);
app.use("/api/auth/users", authRouter, emailRouter);

app.use((req, res) => {
  res.status(404).json({ 
    status: "Not Found",
    message: "Not found." });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    status: "Internal Server Error",
    error: "Unknown error occurred.",
    message: err.message
  });
});

module.exports = app;

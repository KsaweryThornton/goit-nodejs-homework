const express = require("express");
const app = express();

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");

app.use(express.json());
require("./config/passport");
app.use(express.static('./public/avatars'));

app.use("/api/contacts", contactsRouter);
app.use("/api/auth/users", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;

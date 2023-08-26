const express = require("express");
const app = express();
const contactsRouter = require("./routes/api/contacts");

app.use(express.json());
app.use("/api/contacts", contactsRouter);

module.exports = app;

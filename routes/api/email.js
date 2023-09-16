const express = require("express");
const router = express.Router();
const emailController = require("../../controllers/email.controller");
const auth = require("../../middlewares/auth");

router.get("/verify/:verificationToken", auth, emailController.verify);

router.post("/verify", auth, emailController.secondVerify);

module.exports = router;

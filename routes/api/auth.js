const express = require('express');
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const auth = require("../../middlewares/auth");

router.post('/login', authController.signIn);

router.post('/signup', authController.signUp);

router.get('/logout', auth, authController.signOut);

router.get('/current', auth, authController.userList);

module.exports = router;
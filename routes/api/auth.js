const express = require("express");
const router = express.Router();
const multer = require("multer");
const authController = require("../../controllers/auth.controller");
const auth = require("../../middlewares/auth");

const tmpStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./tmp/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadTmp = multer({
  storage: tmpStorage,
});

router.post("/login", authController.signIn);

router.post("/signup", authController.signUp);

router.get("/logout", auth, authController.signOut);

router.get("/current", auth, authController.userList);

router.patch(
  "/avatar",
  auth,
  uploadTmp.single("avatar"),
  authController.updatedAvatar
);

module.exports = router;

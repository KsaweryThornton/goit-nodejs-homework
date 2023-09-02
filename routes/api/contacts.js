const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts.controller");
const auth = require("../../middlewares/auth");

router.get("/", auth, contactsController.get);

router.get("/:id", auth, contactsController.getById);

router.post("/", auth, contactsController.create);

router.put("/:id", auth, contactsController.update);

router.patch("/:id/favorite", auth, contactsController.favorite);

router.delete("/:id", auth, contactsController.remove);

module.exports = router;
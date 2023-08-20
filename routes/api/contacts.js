const express = require("express");

const router = express.Router();

const Joi = require("joi");

const responseSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const foundContact = await getContactById(contactId);
    res.json({
      status: "success",
      code: 200,
      data: { foundContact },
    });
  } catch (err) {
    if (err.message === "Contact not found") {
      res.status(404).json({ message: "Not found" });
    } else {
      next(err);
    }
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact({ name, email, phone });
    const validatedBody = responseSchema.validate(req.body);
    if (validatedBody.error) {
      res.status(400).json({ message: "missing required name - field" });
    } else {
      res.json({
        status: "success",
        code: 201,
        data: { newContact },
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const result = await removeContact(contactId);
  if (!result.success) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json({
    message: "Contact deleted",
    code: 200,
  });
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const { error } = responseSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }
    const { name, email, phone } = req.body;
    const updatedContact = await updateContact(contactId, {
      name,
      email,
      phone,
    });
    if (!updatedContact) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json({
      status: "success",
      code: 200,
      data: { updatedContact },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

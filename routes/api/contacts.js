const express = require("express");
const router = express.Router();
const Joi = require("joi");

const idSchema = Joi.object({
  contactId: Joi.string().length(24).required(),
});

const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
}).or("name", "email", "phone");

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  addContactToFavorite,
} = require("../../service/contacts");
const Contact = require("../../models/contact.model");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json({
      status: "success",
      code: 200,
      data: { contacts },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unknown error occurred." });
  }
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const validateId = idSchema.validate(req.params);
    if (validateId.error) {
      return res.status(400).json({ error: validateId.error.message });
    }
    const contact = await Contact.findOne({ _id: contactId });
    if (!contact) {
      return res.status(404).json({ message: "Not found." });
    }
    const foundContact = await getContactById(contactId);
    res.json({
      status: "success",
      code: 200,
      data: { foundContact },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unknown error occurred." });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validatedBody = addContactSchema.validate(req.body);
    if (validatedBody.error) {
      return res.status(400).json({ message: validatedBody.error.message });
    }
    const newContact = await addContact(req.body);
    res.status(201).json({
      status: "success",
      code: 201,
      data: { newContact },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unknown error occurred." });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const validateId = idSchema.validate(req.params);
    if (validateId.error) {
      return res.status(400).json({ error: validateId.error.message });
    }
    const contact = await Contact.findOne({ _id: contactId });
    if (!contact) {
      return res.status(404).json({ message: "Not found." });
    }
    await removeContact(contactId);
    res.json({
      message: "Contact deleted.",
      code: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unknown error occurred." });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const newContactData = req.body;
  try {
    const validateId = idSchema.validate(req.params);
    if (validateId.error) {
      return res.status(400).json({ error: validateId.error.message });
    }
    const validatedBody = updateContactSchema.validate(req.body);
    if (validatedBody.error) {
      return res.status(400).json({ message: validatedBody.error.message });
    }
    const contact = await Contact.findOne({ _id: contactId });
    if (!contact) {
      return res.status(404).json({ message: "Not found." });
    }
    const updatedContact = await updateContact(contactId, newContactData);
    res.json({
      status: "success",
      code: 200,
      data: { updatedContact },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unknown error occurred." });
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const validateId = idSchema.validate(req.params);
    if (validateId.error) {
      return res.status(400).json({ error: "Missing field favorite." });
    }
    const contact = await Contact.findOne({ _id: contactId });
    if (!contact) {
      return res.status(404).json({ message: "Not found." });
    }
    const addToFavorite = await addContactToFavorite(contactId);
    res.status(201).json({
      status: "success",
      code: 201,
      data: { addToFavorite },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unknown error occurred." });
  }
});

module.exports = router;

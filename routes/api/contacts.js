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
  } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Unknow error occured." })
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
  } catch (error) {
    if (error.message === "Contact not found") {
      res.status(404).json({ message: "Not found" });
    } else {
        console.error(error);
        res.status(500).json({ error: "Unknow error occured." })
        }
    }
  }
);

router.post("/", async (req, res, next) => {
  try {
    const validatedBody = responseSchema.validate(req.body);
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
    res.status(500).json({error: "Unknow error occured."})
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await removeContact(contactId);
  if (!result.success) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json({
    message: "Contact deleted",
    code: 200,
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unknow error occured." })
    }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const newContactData = req.body;
  try {
    const updatedContact = await updateContact(contactId, newContactData);
    res.json({
      status: "success",
      code: 200,
      data: { updatedContact },
    });
  } catch (error) {
    if (error.message === "Contact not found") {
      res.status(404).json({ message: "Not found" });
    } else {
        console.error(error);
        res.status(500).json({ error: "Unknow error occured." })
        }
  }
});

module.exports = router;

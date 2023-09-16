const Joi = require("joi");

const idSchema = Joi.object({
  id: Joi.string().length(24).required(),
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
} = require("../service/contacts.service");
const Contact = require("../models/contact.model");

const get = async (req, res) => {
  try {
    const { query, user } = req;
    const contacts = await listContacts({ ...query, owner: user._id });
    res.status(200).json({
      status: "OK",
      data: {
        contacts: contacts,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      error: "Unknown error occurred.",
      message: error.message,
    });
  }
};

const getById = async (req, res) => {
  const { params, user } = req;
  const { id } = params;
  try {
    const validateId = idSchema.validate({ id: id });
    if (validateId.error) {
      return res.status(400).json({ error: validateId.error.message });
    }
    const contact = await Contact.findOne({ _id: id });
    if (!contact) {
      return res.status(404).json({ message: "Not found." });
    }
    const foundContact = await getContactById(id, user._id);
    res.status(200).json({
      status: "OK",
      data: { contact: foundContact },
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      error: "Unknown error occurred.",
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const { body, user } = req;
    const validatedBody = addContactSchema.validate(body);
    if (validatedBody.error) {
      return res.status(400).json({ message: validatedBody.error.message });
    }
    const newContact = await addContact({ ...body, owner: user._id });
    res.status(201).json({
      status: "Created",
      data: { contact: newContact },
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      error: "Unknown error occurred.",
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { body, user } = req;
  try {
    const validateId = idSchema.validate({ id: id });
    if (validateId.error) {
      return res.status(400).json({
        status: "Bad Request",
        error: validateId.error.message,
      });
    }
    const contact = await Contact.findOne({ _id: id });
    if (!contact) {
      return res.status(404).json({
        status: "Not found",
        message: "Contact not found.",
      });
    }
    const validatedBody = updateContactSchema.validate(body);
    if (validatedBody.error) {
      return res.status(400).json({
        status: "Bad Request",
        message: validatedBody.error.message,
      });
    }
    const updatedContact = await updateContact(id, user._id, body);
    res.status(200).json({
      status: "OK",
      data: { contact: updatedContact },
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      error: "Unknown error occurred.",
      message: error.message,
    });
  }
};

const favorite = async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  try {
    const validateId = idSchema.validate({ id: id });
    if (validateId.error) {
      return res.status(400).json({
        status: "Bad Request",
        error: validateId.error.message,
      });
    }
    const contact = await Contact.findOne({ _id: id });
    if (!contact) {
      return res.status(404).json({
        status: "Not Found",
        message: "Contact not found.",
      });
    }
    const addToFavorite = await addContactToFavorite(id, user._id);
    res.status(201).json({
      status: "Created",
      data: { contact: addToFavorite },
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      error: "Unknown error occurred.",
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const validateId = idSchema.validate({ id: id });
    if (validateId.error) {
      return res.status(400).json({
        status: "Bad Request",
        error: validateId.error.message,
      });
    }
    const contact = await Contact.findOne({ _id: id });
    if (!contact) {
      return res.status(404).json({
        status: "Not Found",
        message: "Contact not found.",
      });
    }
    await removeContact(id, user._id);
    res.status(200).json({
      status: "OK",
      message: "Contact deleted.",
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      error: "Unknown error occurred.",
      message: error.message,
    });
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  favorite,
  remove,
};

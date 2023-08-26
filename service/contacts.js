const Contact = require("../models/contact.model");

const listContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

const getContactById = async (contactId) => {
  const contact = await Contact.findOne({ _id: contactId });
  if (contact) {
    return contact;
  } else {
    throw new Error("Contact not found");
  }
};

const addContact = async (body) => {
  const newContact = await Contact.create(body);
  return newContact;
};

const removeContact = async (contactId) => {
  const result = await Contact.deleteOne({ _id: contactId });
  if (result.deletedCount === 1) {
    return { success: true };
  } else {
    return { success: false };
  }
};

const updateContact = async (contactId, newContactData) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId },
    newContactData,
    { new: true }
  );
  if (!updatedContact) {
    throw new Error("Contact not found");
  }
  return updatedContact;
};

const addContactToFavorite = async (contactId) => {
  const contact = await Contact.findOne({ _id: contactId });
  if (!contact) {
    throw new Error("Missing field favorite");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite: !contact.favorite },
    { new: true }
  );
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  addContactToFavorite,
};

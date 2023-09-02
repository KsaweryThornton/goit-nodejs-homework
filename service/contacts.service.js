const Contact = require("../models/contact.model");

const listContacts = async (query) => {
  return Contact.find(query);
};

const getContactById = async (contactId, userId) => {
  const contact = Contact.findOne({ _id: contactId, owner: userId });
  if (contact) {
    return contact;
  }
};

const addContact = async (body) => {
  return Contact.create(body);
};

const updateContact = async (contactId, userId, newContactData) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    newContactData,
    { new: true }
  );
};

const addContactToFavorite = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, owner: userId });
  if (contact) {
  contact.favorite = !contact.favorite;
  await contact.save();
  return contact;
  }
  
};

const removeContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, owner: userId });
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  addContactToFavorite,
  removeContact,
};
const fs = require('fs/promises');

const { v4: uuidv4 } = require('uuid');
const uniqueId = uuidv4();

const Joi = require("joi");

const responseSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const contactsPath = "models/contacts.json";
const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(contacts);
    const formattedContacts = parsedContacts.map((contact) => {
      return {
        ID: contact.id,
        Name: contact.name,
        Email: contact.email,
        Phone: contact.phone,
      };
    });
    return formattedContacts;
  } catch (err) {
    console.log(err.message);
  }
}

const getContactById = async (contactId) => {
  try {
    const contacts = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(contacts);
    const foundContact = parsedContacts.find((contact) => contact.id === contactId);
    
    if (foundContact) {
      return {
        Name: foundContact.name,
        Email: foundContact.email,
        Phone: foundContact.phone,
      };
    } else {
      throw new Error("Contact not found");
    }
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}

async function addContact(body) {
  try {
const contactsData = await fs.readFile(contactsPath);
const contacts = JSON.parse(contactsData);
const validatedBody = responseSchema.validate(body);
if (!validatedBody.error) {
  body = {id: uniqueId, ...body};
  contacts.push(body);  
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return body;
} else {
  console.log("Validation error:", validatedBody.error.details);
}
} catch (err) {
  console.log(err.message);
}
}

async function removeContact(contactId) {
  try {
    const contacts = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(contacts);
    const contactIndex = parsedContacts.findIndex(contact => contact.id === contactId);
    if (contactIndex !== -1) {
      parsedContacts.splice(contactIndex, 1);
      const updatedContacts = JSON.stringify(parsedContacts, null, 2);
      await fs.writeFile(contactsPath, updatedContacts);
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (err) {
    console.log(err.message);
  }
}

const updateContact = async (contactId, body) => {
  try {
    const contactsData = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(contactsData);
    const contactIndex = parsedContacts.findIndex(contact => contact.id === contactId);
    if (contactIndex !== -1) {
      const validatedBody = responseSchema.validate(body);
      if (!validatedBody.error) {
        parsedContacts[contactIndex] = { ...parsedContacts[contactIndex], ...body };
        await fs.writeFile(contactsPath, JSON.stringify(parsedContacts, null, 2));
        return parsedContacts[contactIndex];
      } else {
        console.log("Validation error:", validatedBody.error.details);
      }
    } else {
      console.log("Contact not found");
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
}
const fs = require('fs/promises');

const { v4: uuidv4 } = require('uuid');
const uniqueId = uuidv4();

const contactsPath = "models/contacts.json";
const listContacts = async () => {
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
}

const getContactById = async (contactId) => {
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
}

async function addContact(body) {
const contactsData = await fs.readFile(contactsPath);
const contacts = JSON.parse(contactsData);
body = {id: uniqueId, ...body};
contacts.push(body);  
await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
return body;
}

async function removeContact(contactId) {
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
}

const updateContact = async (contactId, body) => {
    const contactsData = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(contactsData);
    const contactIndex = parsedContacts.findIndex(contact => contact.id === contactId);
    if (contactIndex !== -1) {
        parsedContacts[contactIndex] = { ...parsedContacts[contactIndex], ...body };
        await fs.writeFile(contactsPath, JSON.stringify(parsedContacts, null, 2));
        return parsedContacts[contactIndex];
      } else {
        throw new Error("Contact not found");
    }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
}
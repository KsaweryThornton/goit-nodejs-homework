const fs = require('fs/promises')
const listContacts = async () => {
  try {
    const contacts = await fs.readFile("/contacts.json");
    const parsedContacts = JSON.parse(contacts);
    const formattedContacts = parsedContacts.map((contact) => {
      return {
        ID: contact.id,
        Name: contact.name,
        Email: contact.email,
        Phone: contact.phone,
      };
    });
    console.table(formattedContacts);
  } catch (err) {
    console.log(err.message);
    return [];
  }
}

// async function getContactById(contactId) {
//   try {
//     const contacts = await fs.readFile(contactsPath);
//     const parsedContacts = JSON.parse(contacts);
//     parsedContacts.find((contact) => {
//       if (contact.id === contactId) {
//         console.log("We found contact: ", contact);
//       }
//     });
//   } catch (err) {
//     console.log(err.message);
//   }
// }

// async function addContact(name, email, phone) {
//   const newContact = {
//     id: nanoid(),
//     name,
//     email,
//     phone,
//   };

//   fs.readFile(contactsPath)
//     .then((data) => {
//       const contactList = JSON.parse(data);
//       contactList.push(newContact);
//       return fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2));
//     })
//     .catch((error) => {
//       console.log(error.message);
//     });
// }

// async function removeContact(contactId) {
//   try {
//     const contacts = await fs.readFile(contactsPath);
//     let parsedContacts = JSON.parse(contacts);

//     parsedContacts = parsedContacts.filter(
//       (contact) => contact.id !== contactId
//     );

//     const updatedContacts = JSON.stringify(parsedContacts, null, 2);
//     fs.writeFile(contactsPath, updatedContacts, async (err) => {
//       if (err) console.log(err.message);
//     });
//   } catch (err) {
//     console.log(err.message);
//   }
// }

// module.exports = { listContacts, getContactById, removeContact, addContact };










const getContactById = async (contactId) => {}

const removeContact = async (contactId) => {}

const addContact = async (body) => {}

const updateContact = async (contactId, body) => {}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}

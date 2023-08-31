const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

const saveContact = async (c) =>
  await fs.writeFile("models/contacts.json", JSON.stringify(c));

const getContacts = async () => {
  const contacts = fs.readFile("models/contacts.json");
  return JSON.parse(await contacts);
};

const listContacts = async () => {
  try {
    return await getContacts();
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await getContacts();

    return contacts.find((c) => c.id === contactId);
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await getContacts();
    const findContactToDelete = contacts.find(
      (contact) => contact.id === contactId
    );

    if (findContactToDelete) {
      const contactsListAfterRemove = contacts.filter(
        (contact) => contact.id !== contactId
      );
      await saveContact(contactsListAfterRemove);

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const addedContact = {
      id: uuidv4(),
      name,
      email,
      phone,
    };

    const contacts = await getContacts();
    contacts.push(addedContact);
    await saveContact(contacts);

    return addedContact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;
    const editContact = {
      name,
      email,
      phone,
    };

    const contacts = await getContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);

    if (index === -1) return false;

    const contact = contacts[index];
    const updatedContact = { ...contact, ...body };
    contacts[index] = updatedContact;

    await saveContact(contacts);

    return contacts;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const readContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
};

const writeContacts = async (updatedList) => {
  await fs.writeFile(
    contactsPath,
    JSON.stringify(updatedList, null, 2),
    "utf-8"
  );
};

const listContacts = async () => {
  try {
    return readContacts();
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await readContacts();
    const showContact = await contacts.find(
      (contact) => String(contact.id) === String(contactId)
    );
    return showContact;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await readContacts();
    const index = contacts.findIndex(
      (contact) => String(contact.id) === String(contactId)
    );
    const updatedList = contacts.filter(
      (contact) => String(contact.id) !== String(contactId)
    );
    if (index !== -1) {
      const result = contacts.splice(index, 1);
      await writeContacts(updatedList);
      return result;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await readContacts();

    const newContact = {
      id: nanoid(5),
      ...body,
    };

    const updatedList = [newContact, ...contacts];
    await writeContacts(updatedList);

    console.log(`Contact has been added`);
    return newContact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await readContacts();
    const updatedContact = await contacts.find((contact) => {
      if (String(contact.id) === String(contactId)) {
        contact.name = body.name ?? contact.name;
        contact.email = body.email ?? contact.email;
        contact.phone = body.phone ?? contact.phone;
        return contact;
      }
    });
    const updatedList = [...contacts];
    await writeContacts(updatedList);
    return contactId ? updatedContact : null;
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

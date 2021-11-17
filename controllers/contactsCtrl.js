const Contact = require("../model");

const listContacts = async (_req, res, next) => {
  try {
    const contacts = await Contact.listContacts();
    return res.json({ status: "success", code: 200, data: { contacts } });
  } catch (error) {
    next();
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.getContactById(req.params.contactId);
    if (!contact) {
      return res.status(400).json({ message: "Not found" });
    }
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const contact = await Contact.addContact(req.body);
    if (!contact) {
      return res.status(400).json({ message: "missing required name field" });
    }
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const contact = await Contact.removeContact(req.params.contactId);
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 201, data: { contact } });
    }
    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.updateContact(req.params.contactId, req.body);
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 201, data: { contact } });
    }
    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

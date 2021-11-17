const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contactsCtrl");
const validate = require("./validation");

router
  .get("/", ctrl.listContacts)
  .post("/", validate.addContact, ctrl.addContact);

router
  .get("/:contactId", ctrl.getContactById)
  .delete("/:contactId", ctrl.removeContact)
  .put("/:contactId", validate.updateContact, ctrl.updateContact);

module.exports = router;

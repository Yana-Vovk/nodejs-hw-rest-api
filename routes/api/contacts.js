const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/contactsCtrl')
const validate = require('./validation')

router
  .get('/', ctrl.listContacts)
  .post('/', validate.addContact, ctrl.addContact)

router
  .get('/:contactId', validate.validateMongoId, ctrl.getContactById)
  .delete('/:contactId', validate.validateMongoId, ctrl.removeContact)
  .put('/:contactId', validate.updateContact, ctrl.updateContact)

router.patch('/:contactId/favorite', validate.validateMongoId, ctrl.getFavorite)

module.exports = router

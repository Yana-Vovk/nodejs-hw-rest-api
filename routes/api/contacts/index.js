const express = require('express')
const router = express.Router()
const ctrl = require('../../../controllers/contactsCtrl')
const validate = require('./validation')
const guard = require('../../../helper/guard')

router
  .get('/', ctrl.listContacts)
  .post('/', validate.addContact, ctrl.addContact)

router
  .get('/:contactId', guard, validate.validateMongoId, ctrl.getContactById)
  .delete('/:contactId', guard, validate.validateMongoId, ctrl.removeContact)
  .put('/:contactId', guard, validate.updateContact, ctrl.updateContact)

router.patch(
  '/:contactId/favorite',
  guard,
  validate.validateMongoId,
  ctrl.getFavorite
)

module.exports = router

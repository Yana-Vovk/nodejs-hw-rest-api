const Contact = require('../repository/contactsModel')
const { HttpCode } = require('../helper/const')

const listContacts = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contacts = await Contact.listContacts(userId, req.query)
    return res.json({ ...contacts })
  } catch (error) {
    next()
  }
}

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contact.getContactById(req.params.contactId, userId)
    if (!contact) {
      return res.status(HttpCode.BAD_REQEST).json({ message: 'Not found' })
    }
    return res.status(HttpCode.OK).json({ contact })
  } catch (error) {
    next(error)
  }
}

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contact.addContact({ ...req.body, owner: userId })
    if (!contact) {
      return res
        .status(HttpCode.BAD_REQEST)
        .json({ message: 'missing required name field' })
    }
    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: 201, data: { contact } })
  } catch (error) {
    next(error)
  }
}

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contact.removeContact(req.params.contactId, userId)
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: 201, data: { contact } })
    }
    return res.status(HttpCode.NOT_FOUND).json({ message: 'Not found' })
  } catch (error) {
    next(error)
  }
}

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contact.updateContact(
      req.params.contactId,
      req.body,
      userId
    )
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: 201, data: { contact } })
    }
    return res.status(HttpCode.NOT_FOUND).json({ message: 'missing fields' })
  } catch (error) {
    next(error)
  }
}
const getFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contact.updateContact(
      req.params.contactId,
      req.body,
      userId
    )
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: 201, data: { contact } })
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({ message: 'missing field favorite' })
  } catch (error) {
    next(error)
  }
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  getFavorite,
}

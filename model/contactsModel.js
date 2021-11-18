const Contact = require('./contactShema')

const listContacts = async () => {
  try {
    const results = await Contact.find({})
    return results
  } catch (error) {
    console.log(error)
  }
}

const getContactById = async (contactId) => {
  try {
    const result = await Contact.findOne({ _id: contactId })
    return result
  } catch (error) {
    console.log(error)
  }
}

const removeContact = async (contactId) => {
  try {
    const result = await Contact.findOneAndRemove({ _id: contactId })
    return result
  } catch (error) {
    console.log(error)
  }
}

const addContact = async (body) => {
  try {
    const result = await Contact.create(body)
    return result
  } catch (error) {
    console.log(error)
  }
}

const updateContact = async (contactId, body) => {
  try {
    const result = await Contact.findOneAndUpdate(
      { _id: contactId },
      { ...body },
      { new: true }
    )
    return result
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}

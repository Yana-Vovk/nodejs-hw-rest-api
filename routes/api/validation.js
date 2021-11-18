const Joi = require('joi')
const mongoose = require('mongoose')

const schemaCreate = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),

  email: Joi.string().email({ minDomainSegments: 2 }),
  phone: Joi.string().required(),
})

const schemaUpdate = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),

  email: Joi.string().email({ minDomainSegments: 2 }),
  phone: Joi.string().optional(),
}).min(1)

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: 400,
      message: `Failed: ${message.replace(/"/g, '')}`,
    })
  }
  next()
}

module.exports.addContact = (req, _res, next) => {
  return validate(schemaCreate, req.body, next)
}

module.exports.updateContact = (req, _res, next) => {
  return validate(schemaUpdate, req.body, next)
}
module.exports.validateMongoId = (req, _res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
    return {
      status: 400,
      message: 'Invalid ObjectId',
    }
  }

  next()
}

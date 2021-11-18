const mongoose = require('mongoose')
require('dotenv').config()
const uriDb = process.env.URI_DB

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.connection.on('connected', () => {
  console.log('Connection open')
})
mongoose.connection.on('disconnected', (e) => {
  console.log('Connection closed')
})

process.on('SIGINT', async () => {
  mongoose.connection.close(() => {
    console.log('Database connection successful')
    process.exit(1)
  })
})

module.exports = db

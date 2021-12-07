const Mailgen = require('mailgen');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

class CreateSenderSG {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return await sgMail.send({
      ...msg,
      from: 'MyContacts <buticiris@gmail.com>',
    });
  }
}

module.exports = { CreateSenderSG };

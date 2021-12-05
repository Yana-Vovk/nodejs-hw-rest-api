const Mailgen = require('mailgen');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000';
        break;
      case 'production':
        this.link = 'link for rpoduction';
        break;
      default:
        this.link = 'http://localhost:3000';
        break;
    }
  }
  #createEmailTemplate(verificationToken, name) {
    const mailGenerator = new Mailgen({
      theme: 'neopolitan',
      product: {
        name: ' MyContacts',
        link: this.link,
      },
    });

    const email = {
      body: {
        name,
        intro:
          "Welcome to MyContacts! We're very excited to have you on board.",
        action: {
          instructions: 'To get started, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verificationToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return mailGenerator.generate(email);
  }
  async sendEmail(verificationToken, email, name) {
    const emailHtml = this.#createEmailTemplate(verificationToken, name);
    const msg = {
      to: email,
      subject: 'Confrim your email',
      html: emailHtml,
    };
    const result = await this.sender.send(msg);
    console.log(result);
  }
}
module.exports = EmailService;

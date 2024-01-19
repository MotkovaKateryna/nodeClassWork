const nodemailer = require('nodemailer');
const path = require('path');
const pug = require('pug');
const { convert } = require('html-to-text');

const { serverConfig } = require('../configs');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = serverConfig.emailFrom;
  }

  // #initTransport - experimental JS private method syntax
  _initTransport() {
    // use MAILGUN in 'prod'
    if (serverConfig.environment === 'production') {
      return nodemailer.createTransport({
        // service: 'Sendgrid',
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
          user: serverConfig.mailgunUser,
          pass: serverConfig.mailgunPasswd,
        },
      });
    }

    // use MAILTRAP in 'dev'
    return nodemailer.createTransport({
      // service: 'Sendgrid',
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: serverConfig.mailtrapUser,
        pass: serverConfig.mailrapPasswd,
      },
    });
  }

  async _send(template, subject) {
    const html = pug.renderFile(path.join(__dirname, '..', 'views', 'email', `${template}.pug`), {
      name: this.name,
      url: this.url,
      subject,
    });

    const emailConfig = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this._initTransport().sendMail(emailConfig);
  }

  async sendHello() {
    await this._send('hello', 'Welcome mail');
  }

  async sendPasswdReset() {
    await this._send('restorePassword', 'Password reset instructions');
  }
}

module.exports = Email;

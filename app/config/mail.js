// import * as dotenv from 'dotenv';

module.exports = {
  smtp: {
    port: process.env.MAIL_PORT || 465,
    host: process.env.MAIL_HOST || 'ssl://smtp.gmail.com',
    auth: {
      user: process.env.MAIL_SMTP_USERNAME || 'noc@octalsoftware.net',
      pass: process.env.MAIL_SMTP_PASSWORD || 'octal#321'
    }
  },
  from: {
    address: 'octal@octallabs.com',
    name: 'Blog'
  }
};

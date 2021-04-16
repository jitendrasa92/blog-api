// import * as dotenv from 'dotenv';

module.exports = {
  smtp: {
    port: process.env.MAIL_PORT || 465,
    host: process.env.MAIL_HOST || 'ssl://mail.octallabs.com',
    auth: {
      user: process.env.MAIL_SMTP_USERNAME || 'octal@octallabs.com',
      pass: process.env.MAIL_SMTP_PASSWORD || 'octal@123'
    }
  },
  from: {
    address: 'octal@octallabs.com',
    name: 'Blog'
  }
};

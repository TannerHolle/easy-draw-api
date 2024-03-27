const nodemailer = require("nodemailer");

const emailId = 'easydrawreset@gmail.com';
const password = 'updzqlshxbjctwai';

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailId,
    pass: password,
  },
});

module.exports = { 
  sendMail: async (options, done) => {
    transporter.sendMail({
      from: emailId,
      to: options.email,
      subject: options.subject,
      html: options.message 
    }, (err, info) => {
      if (err) {
        return done(err);
      }

      console.log("Message sent: %s", info.messageId);
      return done();
    });
  }
};
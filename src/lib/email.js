const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});
// const transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   auth: {
//       user: 'benton.okeefe12@ethereal.email',
//       pass: 'mBY5aKRZP3XS5wTXhF'
//   }
// });

const sendEmail = async (to, subject, body, cc = [], bcc = []) => {
  let emailBody = '';
  for (const [key, value] of Object.entries(body)) {
    emailBody += `${key} => ${value}<br>`;
  }

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to,
    cc,
    subject,
    html: emailBody,
  };
  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

const nodemailer = require('nodemailer');

// 교재 pg.261 참고
const config = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: process.env.GOOGLE_MAIL, pass: process.env.GOOGLE_PASSWORD },
};

const send = async (data) => {
  const transporter = nodemailer.createTransport(config);
  transporter.sendMail(data, (err, info) => {
    if (err) {
      console.log(err);
    }
    return info.response;
  });
};

module.exports = {
  send,
};

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const mail = async function (email, msg) {
  let transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let mailOptions = {
    from: `"Bertin" <${process.env.EMAIL}>`,
    to: email,
    subject: "Thanks For Registering with Us",
    text: msg,
    html: msg
  };
  await transport.sendMail(mailOptions);
};

module.exports = mail;

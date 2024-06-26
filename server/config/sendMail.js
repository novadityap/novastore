import nodemailer from 'nodemailer';
import logger from './logger.js';

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9934482b5c6661",
      pass: "95acff04a49341"
    }
});

const sendMail = async (email, subject, html) => {
  try {
    await transporter.sendMail({
      from: 'admin@novastore',
      to: email,
      subject: subject,
      html: html,
    });

    logger.info('Email sent successfully');
  } catch(err) {
    logger.error(err);
  }
}

export default sendMail;


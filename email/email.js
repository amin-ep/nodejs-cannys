import nodemailer from 'nodemailer';

export default async function sendMail(options) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    tls: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: 'Cannys Clone <info@aminebadi.ir>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  });
}

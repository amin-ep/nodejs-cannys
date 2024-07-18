import sendMail from '../email/email.js';

export default async function (options, res) {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'production'
  ) {
    try {
      await sendMail({
        email: options.email,
        subject: options.subject,
        message: options.message,
        html: options.html,
      });
      res.status(200).json({
        status: 'success',
        message: `An email sent to ${options.email}`,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'something went wrong!',
        err,
      });
    }
  }
}

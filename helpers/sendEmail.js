import sendMail from '../email/email.js';

export default async function (options, res, statusCode) {
  try {
    await sendMail({
      email: options.email,
      subject: options.subject,
      message: options.message,
      html: options.html,
    });
    res.status(statusCode).json({
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

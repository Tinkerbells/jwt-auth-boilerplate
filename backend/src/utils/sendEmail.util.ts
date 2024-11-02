import logger from '../middleware/logger';
import transporter from '../config/nodemailer';
import config from '../config/config';

/**
 * This function sends an email to the given email with the reset password link
 *
 * @param {string} email - The email of the user
 * @param {string} token - The reset password token
 */
export const sendResetEmail = (email: string, code: string) => {
  // const resetLink = `${config.server.url}/api/v1/reset-password/${token}`;
  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: 'Password reset',
    html: `Type this code <b>${code}</b> to reset your password.`
  };
  logger.info('Reset password code: ' + code);
  transporter?.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error);
    } else {
      logger.info('Reset password email sent: ' + info.response);
    }
  });
};

/**
 * This function sends an email to the given email with the email verification link
 *
 * @param {string} email - The email of the user
 * @param {string} token - The email verification token
 */
export const sendVerifyEmail = (email: string, code: string) => {
  // const verifyLink = `${config.server.url}/api/v1/verify-email/${token}`;
  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: 'Email verification',
    html: `Type this code <b>${code}</b> to verify your email.`
  };
  logger.info('Email verification code: ' + code);
  transporter?.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error);
    } else {
      logger.info('Verify email sent: ' + info.response);
    }
  });
};

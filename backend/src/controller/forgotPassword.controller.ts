import type { Response } from 'express';
import httpStatus from 'http-status';
import * as argon2 from 'argon2';
import prismaClient from '../config/prisma';
import type {
  ChangePasswordRequestBodyType,
  EmailRequestBody,
  ResetPasswordRequestBodyType,
  TypedRequest,
  VerifyRequestBody
} from '../types/types';
import { sendResetEmail } from '../utils/sendEmail.util';
import generateOtpCode from '../utils/generateOTP.util';

/**
 * Chnage user password
 * @param req
 * @param res
 * @returns
 */
export const handleChangePassword = async (
  req: TypedRequest<ChangePasswordRequestBodyType>,
  res: Response
) => {
  const { oldPassword, newPassword, email } = req.body;

  // check req.body values
  if (!oldPassword || !newPassword || !email) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Passwords are required'
    });
  }

  const user = await prismaClient.user.findUnique({
    where: {
      email
    }
  });

  if (!user) return res.sendStatus(httpStatus.UNAUTHORIZED);

  try {
    const isPasswordCorrect = await argon2.verify(user.password, oldPassword);
    if (isPasswordCorrect) {
      const hashedPassword = await argon2.hash(newPassword);

      await prismaClient.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });

      return res
        .status(httpStatus.OK)
        .json({ message: 'Password changed successful' });
    } else {
      return res
        .sendStatus(httpStatus.UNAUTHORIZED)
        .json({ message: 'Old password is wrong' });
    }
  } catch (err) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};
/**
 * Sends Forgot password email
 * @param req
 * @param res
 * @returns
 */
export const handleForgotPassword = async (
  req: TypedRequest<EmailRequestBody>,
  res: Response
) => {
  const { email } = req.body;

  // check req.body values
  if (!email) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Email is required!'
    });
  }

  // Check if the email exists in the database
  const user = await prismaClient.user.findUnique({ where: { email } });

  // check if email is verified
  if (!user || !user.emailVerified) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Your email is not verified! Please confirm your email!'
    });
  }

  // Generate a reset token and save it to the database
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 300000); // Token expires in 5 minutes
  await prismaClient.resetCode.create({
    data: {
      code,
      expiresAt,
      userId: user.id
    }
  });

  // Send an email with the reset link
  sendResetEmail(email, code);

  // Return a success message
  return res
    .status(httpStatus.OK)
    .json({ message: 'Password reset email sent' });
};

/**
 * Handles Password reset code check
 * @param req
 * @param res
 * @returns
 */
export const handleCheckResetCode = async (
  req: TypedRequest<VerifyRequestBody>,
  res: Response
) => {
  const { code, email } = req.body;

  if (!code || !email) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Email and code are required' });
  }

  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
  }

  const resetCode = await prismaClient.resetCode.findFirst({
    where: {
      AND: [
        {
          userId: {
            equals: user.id
          }
        },
        { code: { equals: code } },
        { expiresAt: { gt: new Date() } }
      ]
    }
  });

  if (!resetCode) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Invalid or expired token' });
  }

  return res.sendStatus(httpStatus.OK);
};

/**
 * Handles Password reset
 * @param req
 * @param res
 * @returns
 */
export const handleResetPassword = async (
  req: TypedRequest<ResetPasswordRequestBodyType>,
  res: Response
) => {
  const { newPassword, code } = req.body;

  if (!code) return res.sendStatus(httpStatus.NOT_FOUND);

  const resetCode = await prismaClient.resetCode.findFirst({
    where: { code, expiresAt: { gt: new Date() } }
  });

  if (!resetCode) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Invalid or expired token' });
  }
  if (!newPassword) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'New password is required!' });
  }

  // Update the user's password in the database
  const hashedPassword = await argon2.hash(newPassword);

  await prismaClient.user.update({
    where: { id: resetCode.userId },
    data: { password: hashedPassword }
  });

  // Delete the reset and all other reset tokens that the user owns from the database
  await prismaClient.resetCode.deleteMany({
    where: { userId: resetCode.userId }
  });

  // Delete also all refresh tokens
  await prismaClient.refreshToken.deleteMany({
    where: {
      userId: resetCode.userId
    }
  });

  // Return a success message
  return res
    .status(httpStatus.OK)
    .json({ message: 'Password reset successful' });
};

import type { Response } from 'express';
import httpStatus from 'http-status';
import prismaClient from '../config/prisma';
import type {
  EmailRequestBody,
  TypedRequest,
  VerifyRequestBody
} from '../types/types';
import { sendVerifyEmail } from '../utils/sendEmail.util';
import generateOtpCode from '../utils/generateOTP.util';

/**
 * Sends Verification email
 * @param req
 * @param res
 * @returns
 */
export const sendVerificationEmail = async (
  req: TypedRequest<EmailRequestBody>,
  res: Response
) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Email is required!' });
  }

  // Check if the email exists in the database
  const user = await prismaClient.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true }
  });

  if (!user) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: 'Email not found' });
  }

  // Check if the user's email is already verified
  if (user.emailVerified) {
    return res
      .status(httpStatus.CONFLICT)
      .json({ error: 'Email already verified' });
  }

  // Check if there is an existing verification token that has not expired
  const existingToken = await prismaClient.emailVerificationCode.findFirst({
    where: {
      user: { id: user.id },
      expiresAt: { gt: new Date() }
    }
  });

  if (existingToken) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: 'Verification email already sent' });
  }

  // Generate a new verification token and save it to the database
  const code = generateOtpCode();
  // const token = randomUUID();
  const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour
  await prismaClient.emailVerificationCode.create({
    data: {
      code,
      expiresAt,
      userId: user.id
    }
  });

  // Send an email with the new verification link
  sendVerifyEmail(email, code);

  // Return a success message
  return res.status(httpStatus.OK).json({ message: 'Verification email sent' });
};

export const handleVerifyEmail = async (
  req: TypedRequest<VerifyRequestBody>,
  res: Response
) => {
  const { code, email } = req.body;

  if (!code || !email) {
    return res
      .sendStatus(httpStatus.NOT_FOUND)
      .json({ message: 'Email and code are required!' });
  }

  // Check if the token exists in the database and is not expired
  const verificationOtp = await prisma?.emailVerificationCode.findUnique({
    where: { code }
  });

  if (!verificationOtp || verificationOtp.expiresAt < new Date()) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ error: 'Invalid or expired token' });
  }

  // Update the user's email verification status in the database
  await prismaClient.user.update({
    where: { id: verificationOtp.userId },
    data: { emailVerified: new Date() }
  });

  // Delete the verification tokens that the user owns form the database
  await prismaClient.emailVerificationCode.deleteMany({
    where: { userId: verificationOtp.userId }
  });

  // Return a success message
  return res.status(200).json({ message: 'Email verification successful' });
};

import Joi from 'joi';
import type { EmailRequestBody } from '../types/types';
import { type EmailVerificationCode } from '@prisma/client';

export const sendVerifyEmailSchema = {
  body: Joi.object<EmailRequestBody>().keys({
    email: Joi.string().required().email()
  })
};

export const verifyEmailSchema = {
  body: Joi.object<EmailVerificationCode>().keys({
    otp: Joi.string().required().min(6)
  })
};

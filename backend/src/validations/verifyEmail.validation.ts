import Joi from 'joi';
import type { EmailRequestBody, VerifyRequestBody } from '../types/types';

export const sendVerifyEmailSchema = {
  body: Joi.object<EmailRequestBody>().keys({
    email: Joi.string().required().email()
  })
};

export const verifyEmailSchema = {
  body: Joi.object<VerifyRequestBody>().keys({
    code: Joi.string().required().min(6),
    email: Joi.string().required().email()
  })
};

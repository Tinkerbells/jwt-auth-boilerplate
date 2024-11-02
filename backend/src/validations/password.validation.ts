import Joi from 'joi';
import type {
  ChangePasswordRequestBodyType,
  EmailRequestBody,
  VerifyRequestBody
} from '../types/types';

export const changePasswordSchema = {
  body: Joi.object<ChangePasswordRequestBodyType>().keys({
    oldPassword: Joi.string().required().min(8),
    newPassword: Joi.string().required().min(8),
    email: Joi.string().required().email()
  })
};

export const forgotPasswordSchema = {
  body: Joi.object<EmailRequestBody>().keys({
    email: Joi.string().required().email()
  })
};

export const checkResetCodeSchema = {
  body: Joi.object<VerifyRequestBody>().keys({
    email: Joi.string().required().email(),
    code: Joi.string().required().min(6)
  })
};

export const resetPasswordSchema = {
  body: Joi.object().keys({
    newPassword: Joi.string().required().min(8),
    code: Joi.string().required().min(6)
  })
};

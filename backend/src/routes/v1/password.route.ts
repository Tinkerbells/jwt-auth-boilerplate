import { Router } from 'express';
import validate from '../../middleware/validate';
import {
  changePasswordSchema,
  checkResetCodeSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../../validations/password.validation';
import * as passwordController from '../../controller/forgotPassword.controller';

const passwordRouter = Router();

passwordRouter.post(
  '/change-password',
  validate(changePasswordSchema),
  passwordController.handleChangePassword
);

passwordRouter.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  passwordController.handleForgotPassword
);

passwordRouter.post(
  '/check-reset-code',
  validate(checkResetCodeSchema),
  passwordController.handleCheckResetCode
);

passwordRouter.post(
  '/reset-password',
  validate(resetPasswordSchema),
  passwordController.handleResetPassword
);

export default passwordRouter;

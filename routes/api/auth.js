import express from 'express';
import authController from '../../controllers/auth-controller.js';
import { validateBody } from '../../decorators/index.js';
import {
  userSignupSchema,
  userLoginSchema,
  userEmailSchema,
  userPasswordSchema,
  userRoleUpdateSchema,
} from '../../models/User.js';
import { isEmptyBody, authenticate } from '../../middlewares/index.js';

const authRouter = express.Router();

const userSignupValidate = validateBody(userSignupSchema);
const userLoginValidate = validateBody(userLoginSchema);
const userPasswordValidate = validateBody(userPasswordSchema);
const userRoleUpdateValidate = validateBody(userRoleUpdateSchema);

authRouter.post(
  '/signup',
  isEmptyBody,
  userSignupValidate,
  authController.signup
);

authRouter.post('/login', isEmptyBody, userLoginValidate, authController.login);

authRouter.post('/logout', authenticate, authController.logout);

authRouter.delete(
  '/',
  authenticate,
  userPasswordValidate,
  authController.deleteAccount
);

authRouter.get('/current', authenticate, authController.currentUser);

authRouter.get('/verify/:verificationToken', authController.verify);

authRouter.patch(
  '/role-update',
  authenticate,
  isEmptyBody,
  userRoleUpdateValidate,
  authController.roleUpdate
);

export default authRouter;

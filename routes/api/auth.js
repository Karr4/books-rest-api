import express from 'express';
import authController from '../../controllers/auth-controller.js';
import { validateBody } from '../../decorators/index.js';
import {
  userAuthSchema,
  userEmailSchema,
  userPasswordSchema,
  userRoleUpdateSchema,
} from '../../models/User.js';
import authenticate from '../../middlewares/authenticate.js';
import isEmptyBody from '../../middlewares/isEmptyBody.js';

const authRouter = express.Router();

const userAuthValidate = validateBody(userAuthSchema);
const userPasswordValidate = validateBody(userPasswordSchema);
const userRoleUpdateValidate = validateBody(userRoleUpdateSchema);

authRouter.post(
  '/signup',
  isEmptyBody,
  userAuthValidate,
  authController.signup
);

authRouter.post('/login', isEmptyBody, userAuthValidate, authController.login);

authRouter.post('/logout', authenticate, authController.logout);

authRouter.delete(
  '/',
  authenticate,
  userPasswordValidate,
  authController.deleteAccount
);

authRouter.get('/current', authenticate, authController.refreshUser);

authRouter.get('/verify/:verificationToken', authController.verify);

authRouter.patch(
  '/role-update',
  authenticate,
  isEmptyBody,
  userRoleUpdateValidate,
  authController.roleUpdate
);

export default authRouter;

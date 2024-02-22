import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { ctrlWrapper } from '../decorators/index.js';
import HttpError from '../helpers/HttpError.js';
import { User } from '../models/User.js';
import sendEmail from '../helpers/sendEmail.js';
import jwt from 'jsonwebtoken';

const { JWT_SECRET, BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email, password, role = 'client' } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  await User.create({
    email,
    password: hashedPassword,
    role,
    verificationToken,
  });

  const emailVerificationData = {
    to: email,
    subject: 'Email verification',
    html: `
            <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>
        `,
  };

  await sendEmail(emailVerificationData);

  res.status(201).json({
    user: {
      email: email,
      role,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  if (!user.verified) {
    throw HttpError(403, 'Forbidden request due to not verified email');
  }

  const comparedPassword = await bcrypt.compare(password, user.password);
  if (!comparedPassword) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  const loggedUser = await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: loggedUser.email,
      role: loggedUser.role,
      favorites: loggedUser.favorites,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).json();
};

const currentUser = async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });

  res.json({
    user: {
      email: user.email,
      role: user.role,
      favorites: user.favorites,
    },
  });
};

const deleteAccount = async (req, res) => {
  const { password } = req.body;

  const user = req.user;
  const comparedPassword = await bcrypt.compare(password, user.password);

  if (!comparedPassword) {
    throw HttpError(401, 'Wrong password');
  }

  await User.findByIdAndDelete(user._id);

  res.json({ message: 'User deleted' });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404);
  }

  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verified: true,
  });

  res.json({ message: 'Verification successful' });
};

const roleUpdate = async (req, res) => {
  const { userId, role } = req.body;
  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw HttpError(404);
  }

  await User.findByIdAndUpdate(user._id, {
    role,
  });

  res.json({ message: 'Role updated' });
};

export default {
  signup: ctrlWrapper(signup),
  login: ctrlWrapper(login),
  currentUser: ctrlWrapper(currentUser),
  logout: ctrlWrapper(logout),
  deleteAccount: ctrlWrapper(deleteAccount),
  verify: ctrlWrapper(verify),
  roleUpdate: ctrlWrapper(roleUpdate),
};

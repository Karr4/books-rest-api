import { Schema, model } from 'mongoose';
import Joi from 'joi';

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

const roles = ['client', 'admin'];

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    token: String,
    verificationToken: {
      type: String,
      default: '',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: roles,
      default: 'client',
    },
    favorites: [
      {
        _id: String,
        title: String,
        releaseDate: String,
        genres: [String],
        authors: [String],
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const User = model('user', userSchema);

const userAuthSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().pattern(passwordRegex).required(),
  role: Joi.string().valid(...roles),
});

const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

const userPasswordSchema = Joi.object({
  password: Joi.string().pattern(passwordRegex).required(),
});

const userRoleUpdateSchema = Joi.object({
  userId: Joi.string().required(),
  role: Joi.string()
    .valid(...roles)
    .required(),
});

export {
  User,
  userAuthSchema,
  userEmailSchema,
  userPasswordSchema,
  userRoleUpdateSchema,
};

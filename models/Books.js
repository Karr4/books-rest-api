import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleSaveError, runValidatorsAtUpdate } from './hooks.js';

const titleRegex = /^[A-Za-z0-9\s\-_,\.;:()]+$/;

const bookSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required'],
  },
  genres: [String],
  authors: [String],
});

bookSchema.post('save', handleSaveError);

bookSchema.pre('findOneAndUpdate', runValidatorsAtUpdate);

bookSchema.post('findOneAndUpdate', handleSaveError);

const Book = model('book', bookSchema);

const bookAddSchema = Joi.object({
  title: Joi.string().pattern(titleRegex).required(),
  releaseDate: Joi.string(),
  genres: Joi.array().items(Joi.string()),
  authors: Joi.array().items(Joi.string()),
});

const bookUpdateSchema = Joi.object({
  title: Joi.string().pattern(titleRegex),
  releaseDate: Joi.string(),
  genres: Joi.array().items(Joi.string()),
  authors: Joi.array().items(Joi.string()),
});

const favoritesAddSchema = Joi.object({
  bookId: Joi.string().required(),
});

export { Book, bookAddSchema, bookUpdateSchema, favoritesAddSchema };

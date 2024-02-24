import { ctrlWrapper } from '../decorators/index.js';
import HttpError from '../helpers/HttpError.js';
import { Book } from '../models/Books.js';
import { User } from '../models/User.js';

const getBooks = async (req, res, next) => {
  const result = await Book.find();
  res.json(result);
};

const getBookById = async (req, res, next) => {
  const { bookId } = req.params;

  const result = await Book.findOne({ _id: bookId });
  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
};

const getFavoriteBooks = async (req, res, next) => {
  const { favorites } = req.user;
  res.json({ favorites });
};

const addBookToFavorites = async (req, res, next) => {
  const { _id } = req.user;
  const { bookId } = req.body;

  const newFavorite = await Book.findOne({ _id: bookId });
  if (!newFavorite) {
    throw HttpError(404, 'Not found');
  }

  const result = await User.findOneAndUpdate(
    { _id },
    { $push: { favorites: newFavorite } }
  );

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.status(201).json({ newFavorite });
};

const removeBookFromFavorites = async (req, res, next) => {
  const { _id } = req.user;
  const { bookId } = req.body;

  const bookToRemove = await Book.findOne({ _id: bookId });
  if (!bookToRemove) {
    throw HttpError(404, 'Not found');
  }

  const result = await User.findOneAndUpdate(
    { _id },
    { $pull: { favorites: { _id: bookToRemove._id } } }
  );

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json({
    message: 'Book deleted from favorites',
  });
};

const addBook = async (req, res, next) => {
  const { role } = req.user;

  if (role !== 'admin') {
    throw HttpError(401, 'Forbidden due to inappropriate role');
  }

  const result = await Book.create({ ...req.body });
  res.status(201).json(result);
};

const deleteBook = async (req, res, next) => {
  const { role } = req.user;
  const { bookId } = req.params;

  if (role !== 'admin') {
    throw HttpError(401, 'Forbidden due to inappropriate role');
  }

  const result = await Book.findOneAndDelete({ _id: bookId });

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json({ message: 'Book deleted' });
};

const updateBook = async (req, res, next) => {
  const { role } = req.user;
  const { bookId } = req.params;

  if (role !== 'admin') {
    throw HttpError(401, 'Forbidden due to inappropriate role');
  }

  const result = await Book.findOneAndUpdate({ _id: bookId }, req.body);
  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
};

export default {
  getBooks: ctrlWrapper(getBooks),
  getBookById: ctrlWrapper(getBookById),
  getFavoriteBooks: ctrlWrapper(getFavoriteBooks),
  addBookToFavorites: ctrlWrapper(addBookToFavorites),
  removeBookFromFavorites: ctrlWrapper(removeBookFromFavorites),
  addBook: ctrlWrapper(addBook),
  deleteBook: ctrlWrapper(deleteBook),
  updateBook: ctrlWrapper(updateBook),
};

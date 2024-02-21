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

  console.log(result);

  res.json(result);
};

const getFavoriteBooks = async (req, res, next) => {
  const { _id, favorites } = req.user;
  console.log(req.user);

  // const result = await User.findOne({ _id });

  // if (!result) {
  //   throw HttpError(404, 'Not found');
  // }

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

  res.status(201).json({ favorites: [...result.favorites, newFavorite] });
};

const addBook = async (req, res, next) => {
  const { role } = req.user;

  if (role !== 'admin') {
    throw HttpError(403, 'Forbidden');
  }

  const result = await Book.create({ ...req.body });
  res.status(201).json(result);
};

const deleteBook = async (req, res, next) => {
  const { role } = req.user;
  const { bookId } = req.params;

  console.log(role);

  if (role !== 'admin') {
    throw HttpError(403, 'Forbidden');
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
    throw HttpError(403, 'Forbidden');
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
  addBook: ctrlWrapper(addBook),
  deleteBook: ctrlWrapper(deleteBook),
  updateBook: ctrlWrapper(updateBook),
};

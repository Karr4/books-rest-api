import express from 'express';
import booksController from '../../controllers/books-controller.js';
import { validateBody } from '../../decorators/index.js';
import {
  bookAddSchema,
  bookUpdateSchema,
  favoritesAddSchema,
} from '../../models/Books.js';
import {
  isEmptyBody,
  isValidId,
  authenticate,
} from '../../middlewares/index.js';

const booksRouter = express.Router();

const bookAddValidate = validateBody(bookAddSchema);
const bookUpdateValidate = validateBody(bookUpdateSchema);

booksRouter.get('/', booksController.getBooks);

booksRouter.get('/:bookId', isValidId, booksController.getBookById);

booksRouter.get('/favorite', authenticate, booksController.getFavoriteBooks);

booksRouter.post(
  '/favorite',
  authenticate,
  isEmptyBody,
  booksController.addBookToFavorites
);

booksRouter.delete(
  '/favorite',
  authenticate,
  isEmptyBody,
  booksController.removeBookFromFavorites
);

booksRouter.post(
  '/',
  authenticate,
  isEmptyBody,
  bookAddValidate,
  booksController.addBook
);

booksRouter.delete(
  '/:bookId',
  authenticate,
  isValidId,
  booksController.deleteBook
);

booksRouter.put(
  '/:bookId',
  authenticate,
  isValidId,
  isEmptyBody,
  bookUpdateValidate,
  booksController.updateBook
);

export default booksRouter;

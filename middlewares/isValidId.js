import { isValidObjectId } from 'mongoose';

import { HttpError } from '../helpers/index.js';

const isValidId = (req, res, next) => {
  const { bookId } = req.params;
  if (!isValidObjectId(bookId)) {
    return next(HttpError(404, `Not found`));
  }
  next();
};

export default isValidId;

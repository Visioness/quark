import { validationResult } from 'express-validator';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const error = new Error('Validation failed.');
  error.statusCode = 400;
  error.data = errors.array().map((e) => ({ path: e.path, message: e.msg }));
  next(error);
};

export { validateRequest };

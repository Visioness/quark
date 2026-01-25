import { validationResult } from 'express-validator';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    message: 'Invalid field/s.',
    errors: errors.array().map((e) => ({ path: e.path, message: e.msg })),
  });
};

export { validateRequest };

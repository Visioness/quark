import { body, query } from 'express-validator';

const logInValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 - 20 characters length.'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8, max: 12 })
    .withMessage('Password must be between 8 - 12 characters length.')
    .bail()
    .isStrongPassword()
    .withMessage(
      'Password must contain at least one character for each. (Uppercase, lowercase, number, symbol)'
    ),
];

const signUpValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 - 20 characters length.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('E-Mail is required.')
    .isEmail()
    .withMessage('Invalid E-Mail format.'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8, max: 12 })
    .withMessage('Password must be between 8 - 12 characters length.')
    .bail()
    .isStrongPassword()
    .withMessage(
      'Password must contain at least one character for each. (Uppercase, lowercase, number, symbol)'
    ),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('Confirmation is required.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
];

const paginationValidation = [
  query('cursor')
    .optional()
    .trim()
    .isString()
    .withMessage('Cursor must be a string.')
    .isLength({ min: 1, max: 64 })
    .withMessage('Cursor must be between 1 - 64 characters length.'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 - 100.')
    .toInt(),
];

export { logInValidation, signUpValidation, paginationValidation };

import { body } from 'express-validator';

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password min length 6'),
];

export const registerValidator = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isString().isLength({ min: 8 }).withMessage('Password min length 8'),
  body('fullName').isString().isLength({ min: 2 }),
  body('role').isIn(['ADMIN','USER']).withMessage('Role must be ADMIN or USER')
];

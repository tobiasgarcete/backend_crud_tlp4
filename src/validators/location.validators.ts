import { body } from 'express-validator';

export const locationCreateValidator = [
  body('code').isString().trim().notEmpty(),
  body('name').isString().trim().notEmpty(),
  body('notes').optional().isString()
];

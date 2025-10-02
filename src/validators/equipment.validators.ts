import { body, param } from 'express-validator';

export const equipmentCreateValidator = [
  body('assetTag').isString().trim().notEmpty(),
  body('serialNumber').isString().trim().notEmpty(),
  body('brand').isString().trim().notEmpty(),
  body('model').isString().trim().notEmpty(),
  body('category').isString().trim().notEmpty(),
  body('status').optional().isIn(['IN_STOCK','ASSIGNED','REPAIR','RETIRED']),
  body('purchaseDate').optional().isISO8601(),
  body('warrantyUntil').optional().isISO8601(),
  body('assignedToId').optional().isString(),
  body('locationId').optional().isString(),
];

export const equipmentUpdateValidator = [
  param('id').isString(),
  body('assetTag').optional().isString().trim().notEmpty(),
  body('serialNumber').optional().isString().trim().notEmpty(),
  body('brand').optional().isString().trim().notEmpty(),
  body('model').optional().isString().trim().notEmpty(),
  body('category').optional().isString().trim().notEmpty(),
  body('status').optional().isIn(['IN_STOCK','ASSIGNED','REPAIR','RETIRED']),
  body('purchaseDate').optional().isISO8601(),
  body('warrantyUntil').optional().isISO8601(),
  body('assignedToId').optional().isString(),
  body('locationId').optional().isString(),
];

export const assignValidator = [
  param('id').isString(),
  body('userId').isString().notEmpty(),
];

export const transferValidator = [
  param('id').isString(),
  body('locationId').isString().notEmpty(),
];

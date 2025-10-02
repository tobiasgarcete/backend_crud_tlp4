import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import * as ctrl from '../controllers/location.controller.js';
import { locationCreateValidator } from '../validators/location.validators.js';
import { validate } from '../middlewares/validate.js';

const router = Router();
router.use(requireAuth);

router.get('/', ctrl.list);
router.post('/', requireRole('ADMIN'), locationCreateValidator, validate, ctrl.create);

export default router;

import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import * as ctrl from '../controllers/equipment.controller.js';
import { validate } from '../middlewares/validate.js';
import { equipmentCreateValidator, equipmentUpdateValidator, assignValidator, transferValidator } from '../validators/equipment.validators.js';

const router = Router();
router.use(requireAuth);

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.get('/:id/history', ctrl.history);

router.post('/', requireRole('ADMIN'), equipmentCreateValidator, validate, ctrl.create);
router.put('/:id', requireRole('ADMIN'), equipmentUpdateValidator, validate, ctrl.update);
router.delete('/:id', requireRole('ADMIN'), ctrl.remove);

router.post('/:id/assign', requireRole('ADMIN'), assignValidator, validate, ctrl.assign);
router.post('/:id/transfer', requireRole('ADMIN'), transferValidator, validate, ctrl.transfer);

export default router;

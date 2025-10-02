import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import * as ctrl from '../controllers/user.controller.js';

const router = Router();
router.use(requireAuth);
router.get('/me', ctrl.me);
router.get('/', requireRole('ADMIN'), ctrl.all);

export default router;

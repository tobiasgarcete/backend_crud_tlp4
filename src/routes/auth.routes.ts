import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { loginValidator, registerValidator } from '../validators/auth.validators.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.post('/login', loginValidator, validate, login);
router.post('/register', registerValidator, validate, register);

// Esta ruta se puede usar después de tener el primer administrador
//router.post('/admin/register', requireAuth, requireRole('ADMIN'), registerValidator, validate, register);

export default router;
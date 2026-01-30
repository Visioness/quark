import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { getProfile } from '../controllers/profile.js';

const router = Router();

router.get('/:username', requireAuth, getProfile);

export { router as profileRouter };

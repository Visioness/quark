import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  logInValidation,
  signUpValidation,
} from '../validators/validations.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  signUp,
  logIn,
  logOut,
  logOutAllSessions,
  refreshToken,
} from '../controllers/auth.js';

const router = Router();

router.post('/sign-up', signUpValidation, validateRequest, signUp);
router.post('/log-in', logInValidation, validateRequest, logIn);
router.post('/log-out', requireAuth, logOut);
router.post('/log-out-all', requireAuth, logOutAllSessions);
router.post('/refresh', refreshToken);

export { router as authRouter };

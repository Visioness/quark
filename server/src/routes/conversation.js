import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  getConversation,
  getUserConversations,
  getMessages,
} from '../controllers/conversation.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { paginationValidation } from '../validators/validations.js';

const router = Router();

router.use(requireAuth);
router.get('/', getUserConversations);
router.get('/:conversationId', getConversation);
router.get(
  '/:conversationId/messages',
  paginationValidation,
  validateRequest,
  getMessages
);

export { router as conversationRouter };

import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  getConversation,
  getUserConversations,
} from '../controllers/conversation.js';

const router = Router();

router.use(requireAuth);
router.get('/', getUserConversations);
router.get('/:conversationId', getConversation);

export { router as conversationRouter };

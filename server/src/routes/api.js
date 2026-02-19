import { Router } from 'express';
import { authRouter } from './auth.js';
import { profileRouter } from './profile.js';
import { friendRouter } from './friend.js';
import { conversationRouter } from './conversation.js';
import { groupRouter } from './group.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/friends', friendRouter);
router.use('/conversations', conversationRouter);
router.use('/groups', groupRouter);

export { router };

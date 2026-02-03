import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from '../controllers/friend.js';

const router = Router();

router.use(requireAuth);

router.get('/', getFriends);
router.delete('/:username', removeFriend);

router.get('/requests', getFriendRequests);
router.post('/requests/:username', sendFriendRequest);
router.put('/requests/:username/accept', acceptFriendRequest);
router.put('/requests/:username/reject', rejectFriendRequest);

export { router as friendRouter };

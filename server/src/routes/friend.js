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
router.delete('/:friendId', removeFriend);

router.get('/requests', getFriendRequests);
router.post('/requests/:username', sendFriendRequest);
router.put('/requests/:senderId/accept', acceptFriendRequest);
router.put('/requests/:senderId/reject', rejectFriendRequest);

export { router as friendRouter };

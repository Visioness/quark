import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  groupValidation,
  durationValidation,
} from '../validators/validations.js';
import {
  createGroup,
  deleteGroup,
  leaveGroup,
  transferOwnership,
} from '../controllers/group.js';
import {
  getAllInvites,
  createInvite,
  deleteInvite,
  joinViaInvite,
} from '../controllers/invite.js';

const router = Router();

router.use(requireAuth);

router.post('/', groupValidation, validateRequest, createGroup);
router.delete('/:groupId', deleteGroup);
router.delete('/:groupId/leave', leaveGroup);
router.put('/:groupId/transfer/:newOwnerId', transferOwnership);

router.get('/:groupId/invites', getAllInvites);
router.post(
  '/:groupId/invites',
  durationValidation,
  validateRequest,
  createInvite
);
router.delete('/invites/:inviteCode', deleteInvite);
router.post('/invites/:inviteCode', joinViaInvite);

// Promote demote
// Message management perms
// Kick user
// Ban user

export { router as groupRouter };

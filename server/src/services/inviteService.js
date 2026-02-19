import {
  verifyConversation,
  verifyParticipant,
} from './conversationService.js';
import { joinGroup } from './groupService.js';
import * as inviteModel from '../models/inviteModel.js';

const getAllInvites = async (groupId, userId) => {
  await verifyConversation(groupId);
  const participant = await verifyParticipant(groupId, userId);

  if (participant.role === 'MEMBER') {
    const error = new Error('Only owner and admins can see the invite links.');
    error.statusCode = 403;
    throw error;
  }

  return await inviteModel.getAllInvites(groupId);
};

const createInvite = async (groupId, userId, duration) => {
  await verifyConversation(groupId);
  const participant = await verifyParticipant(groupId, userId);

  if (participant.role === 'MEMBER') {
    const error = new Error('Only owner and admins can create invite links.');
    error.statusCode = 403;
    throw error;
  }

  let expiresAt = null;
  if (duration) {
    expiresAt = new Date(Date.now() + duration);
  }

  return await inviteModel.createInvite(groupId, userId, expiresAt);
};

const deleteInvite = async (inviteCode, userId) => {
  const invite = await inviteModel.getInvite(inviteCode);

  if (!invite) {
    const error = new Error('Invite link not found.');
    error.statusCode = 404;
    throw error;
  }

  const participant = await verifyParticipant(invite.conversationId, userId);

  if (participant.role === 'MEMBER') {
    const error = new Error('Only owner and admins can delete invite links.');
    error.statusCode = 403;
    throw error;
  }

  await inviteModel.deleteInvite(inviteCode);
};

const joinViaInvite = async (inviteCode, userId) => {
  const invite = await inviteModel.getInvite(inviteCode);

  if (!invite) {
    const error = new Error('Invite link not found.');
    error.statusCode = 404;
    throw error;
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    const error = new Error('Invite link expired.');
    error.statusCode = 410;
    throw error;
  }

  return await joinGroup(invite.conversationId, userId);
};

export { getAllInvites, createInvite, deleteInvite, joinViaInvite };

import {
  createMessage,
  verifyConversation,
  verifyParticipant,
} from '../services/conversationService.js';
import * as conversationModel from '../models/conversationModel.js';
import { appEvents } from '../lib/events.js';

const createGroup = async (groupName, userId) => {
  const existingGroup = await conversationModel.getGroup(groupName, userId);

  if (existingGroup) {
    const error = new Error(
      'You already have an existing group with this name.'
    );
    error.statusCode = 409;
    throw error;
  }

  const conversation = await conversationModel.createGroup(groupName, userId);

  const message = await createMessage(
    'USER_JOINED',
    conversation.id,
    'joined the chat.',
    userId
  );

  appEvents.emit('conversation:join', {
    conversation,
    participants: conversation.participants,
    messages: [message],
  });

  return conversation;
};

const deleteGroup = async (groupId, userId) => {
  await verifyConversation(groupId);
  const participant = await verifyParticipant(groupId, userId);

  if (participant.role !== 'OWNER') {
    const error = new Error('Groups can be deleted only by their owner.');
    error.statusCode = 403;
    throw error;
  }

  appEvents.emit('conversation:delete', { conversationId: groupId });
  await conversationModel.deleteGroup(groupId);
};

const joinGroup = async (groupId, userId) => {
  await verifyConversation(groupId);
  const participant = await conversationModel.verifyParticipant(
    groupId,
    userId
  );

  if (participant) {
    const error = new Error('You have already joined this group.');
    error.statusCode = 400;
    throw error;
  }

  const { conversation, ...newParticipant } = await conversationModel.joinGroup(
    groupId,
    userId
  );

  const { id, conversationId, ...withoutIds } = newParticipant;

  const message = await createMessage(
    'USER_JOINED',
    groupId,
    'joined the chat.',
    userId
  );

  appEvents.emit('conversation:join', {
    conversation,
    participants: [withoutIds],
    messages: [message],
  });

  return conversation;
};

const leaveGroup = async (groupId, userId) => {
  const participant = await verifyParticipant(groupId, userId);

  if (participant.role === 'OWNER') {
    const error = new Error(
      'You must transfer the ownership before leaving the group.'
    );
    error.statusCode = 409;
    throw error;
  }

  const message = await createMessage(
    'USER_LEFT',
    groupId,
    'left the chat.',
    userId
  );

  await conversationModel.leaveGroup(groupId, userId);

  appEvents.emit('conversation:leave', {
    conversationId: groupId,
    participant,
    message,
  });
};

const transferOwnership = async (groupId, previousId, nextId) => {
  await verifyConversation(groupId, true);
  const previous = await verifyParticipant(groupId, previousId);

  if (previous.role !== 'OWNER') {
    const error = new Error('You must be owner to transfer the ownership.');
    error.statusCode = 403;
    throw error;
  }

  await verifyParticipant(groupId, nextId);

  return await conversationModel.transferOwnership(groupId, previousId, nextId);
};

export { createGroup, deleteGroup, joinGroup, leaveGroup, transferOwnership };

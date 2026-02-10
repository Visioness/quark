import * as conversationModel from '../models/conversationModel.js';
import * as friendModel from '../models/friendModel.js';

const getConversation = async (conversationId, userId) => {
  const existingConversation = await conversationModel.getConversation(
    conversationId
  );

  if (
    !existingConversation ||
    !existingConversation.participants.find((p) => p.userId === userId)
  ) {
    const error = new Error('Conversation not found.');
    error.statusCode = 404;
    throw error;
  }

  return existingConversation;
};

const getPreviousConversation = async (userId, friendId) => {
  return await conversationModel.getPreviousConversation(userId, friendId);
};

const getUserConversations = async (userId) => {
  const conversations = await conversationModel.getUserConversations(userId);

  const conversationIds = conversations.map((conv) => conv.id);
  const unreadCounts = await conversationModel.getUnreadCounts(
    conversationIds,
    userId
  );

  const unreadMap = new Map(
    unreadCounts.map((row) => [row.conversationId, row.unread])
  );

  return conversations.map((conv) => ({
    ...conv,
    unread: unreadMap.get(conv.id) || 0,
  }));
};

const createConversation = async (userId, friendId) => {
  const friendship = await friendModel.findFriendship(userId, friendId);

  if (!friendship) {
    const error = new Error('You can only start conversations with friends.');
    error.statusCode = 403;
    throw error;
  }

  return await conversationModel.createConversation(userId, friendId);
};

const createMessage = async (conversationId, content, senderId) => {
  await verifyParticipant(conversationId, senderId);

  if (content.trim() === '') {
    const error = new Error('Message content cannot be empty.');
    error.statusCode = 400;
    throw error;
  }

  return await conversationModel.createMessage(
    conversationId,
    content,
    senderId
  );
};

const markAsRead = async (conversationId, userId) => {
  await verifyParticipant(conversationId, userId);

  return await conversationModel.markAsRead(conversationId, userId);
};

const verifyParticipant = async (conversationId, userId) => {
  const participant = await conversationModel.getParticipant(
    conversationId,
    userId
  );

  if (!participant) {
    const error = new Error('Conversation not found.');
    error.statusCode = 404;
    throw error;
  }
};

export {
  getConversation,
  getPreviousConversation,
  getUserConversations,
  createConversation,
  createMessage,
  markAsRead,
};

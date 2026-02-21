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

const getMessages = async (conversationId, userId, { cursor, limit = 30 }) => {
  await verifyParticipant(conversationId, userId);

  return await conversationModel.getMessages(conversationId, { cursor, limit });
};

const createDM = async (userId, friendId) => {
  const friendship = await friendModel.findFriendship(userId, friendId);

  if (!friendship) {
    const error = new Error('You can only start conversations with friends.');
    error.statusCode = 403;
    throw error;
  }

  return await conversationModel.createDM(userId, friendId);
};

const createMessage = async (type, conversationId, content, senderId) => {
  if (type === 'TEXT') {
    await verifyParticipant(conversationId, senderId);

    if (content.trim() === '') {
      const error = new Error('Message content cannot be empty.');
      error.statusCode = 400;
      throw error;
    }
  }

  await conversationModel.updateLastMessageAt(conversationId);

  return await conversationModel.createMessage(
    type,
    conversationId,
    content,
    senderId
  );
};

const markAsRead = async (conversationId, userId) => {
  await verifyParticipant(conversationId, userId);

  return await conversationModel.markAsRead(conversationId, userId);
};

const verifyConversation = async (conversationId, isGroup = false) => {
  const conversation = await conversationModel.verifyConversation(
    conversationId
  );

  if (!conversation) {
    const error = new Error(`${isGroup ? 'Group' : 'Conversation'} not found.`);
    error.statusCode = 404;
    throw error;
  }
};

const verifyParticipant = async (conversationId, userId) => {
  const participant = await conversationModel.verifyParticipant(
    conversationId,
    userId
  );

  if (!participant) {
    const error = new Error('Not a member in this conversation.');
    error.statusCode = 403;
    throw error;
  }

  return participant;
};

export {
  getConversation,
  getPreviousConversation,
  getUserConversations,
  getMessages,
  createDM,
  createMessage,
  markAsRead,
  verifyConversation,
  verifyParticipant,
};

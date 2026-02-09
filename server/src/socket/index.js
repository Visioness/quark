import jwt from 'jsonwebtoken';
import * as conversationService from '../services/conversationService.js';
import { appEvents } from '../lib/events.js';

const handleSocketEvent = (socket, handler) => {
  return async (...args) => {
    const lastArg = args[args.length - 1];
    const callback = typeof lastArg === 'function' ? lastArg : null;

    try {
      await handler(...args);
    } catch (error) {
      console.error(`Socket error for ${socket.user.id}: `, error.message);

      if (callback) {
        callback({
          success: false,
          error: error.message || 'Something went wrong.',
        });
      }

      socket.emit('error:server', {
        message: error.message || 'Something went wrong.',
        statusCode: error.statusCode || 500,
      });
    }
  };
};

export const initSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const decoded = jwt.verify(token, process.env.SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      const message =
        error.name === 'TokenExpiredError'
          ? 'Token expired.'
          : 'Invalid token.';
      const newError = new Error(message);
      newError.statusCode = 401;
      return next(newError);
    }
  });

  appEvents.on('conversation:created', ({ conversation, participantIds }) => {
    participantIds.forEach((userId) => {
      io.in(userId).socketsJoin(conversation.id);
      io.to(userId).emit('conversation:new', conversation);
    });
  });

  io.on('connection', async (socket) => {
    const userId = socket.user.id;
    socket.join(userId);

    const conversations = await conversationService.getUserConversations(
      userId
    );
    conversations.forEach((conv) => {
      socket.join(conv.id);
    });

    socket.on(
      'message:send',
      handleSocketEvent(socket, async (conversationId, content, callback) => {
        if (typeof conversationId !== 'string' || typeof content !== 'string') {
          const error = new Error('Invalid message format.');
          error.statusCode = 400;
          throw error;
        }

        const trimmed = content.trim();
        if (trimmed.length === 0) {
          const error = new Error('Message can not be empty.');
          error.statusCode = 400;
          throw error;
        }
        if (trimmed.length > 2000) {
          const error = new Error('Message too long (max 2000 characters).');
          error.statusCode = 400;
          throw error;
        }

        const message = await conversationService.createMessage(
          conversationId,
          trimmed,
          userId
        );

        // Broadcast to all other users in the conversation
        socket.to(conversationId).emit('message:receive', message);

        // Acknowledge the sender with the saved message
        if (typeof callback === 'function') {
          callback({ success: true, message });
        }
      })
    );

    socket.on(
      'conversation:read',
      handleSocketEvent(socket, async (conversationId) => {
        if (typeof conversationId !== 'string') {
          const error = new Error('Invalid conversation ID.');
          error.statusCode = 400;
          throw error;
        }

        await conversationService.markAsRead(conversationId, userId);
      })
    );
  });
};

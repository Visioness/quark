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
        error.name === 'TokenExpiredError' ?
          'Token expired.'
        : 'Invalid token.';
      const newError = new Error(message);
      newError.statusCode = 401;
      return next(newError);
    }
  });

  appEvents.on(
    'conversation:join',
    async ({ conversation, participants, messages }) => {
      participants.forEach((participant) => {
        io.in(participant.userId).socketsJoin(conversation.id);
        io.to(participant.userId).emit('conversation:new', conversation);
        io.to(conversation.id).emit(
          'conversation:participant:joined',
          conversation.id,
          participant
        );
      });

      messages?.forEach((message) => {
        io.to(conversation.id).emit('message:receive', message);
      });

      // Initial online statuses for new conversation
      const onlineUserIds = new Set();
      const sockets = await io.in(conversation.id).fetchSockets();
      for (const s of sockets) {
        onlineUserIds.add(s.user.id);
      }

      participants.forEach((participant) => {
        if (onlineUserIds.has(participant.userId)) {
          // Notify the conversation that the new user is online
          io.to(conversation.id).emit('user:online', participant.userId);
        }

        // Notify the user about each online user in the conversation
        io.to(participant.userId).emit('user:online', [...onlineUserIds]);
      });
    }
  );

  appEvents.on(
    'conversation:leave',
    async ({ conversationId, participant, message }) => {
      io.to(conversationId).emit(
        'conversation:participant:left',
        conversationId,
        participant
      );
      io.to(conversationId).emit('message:receive', message);

      io.to(participant.userId).emit('conversation:delete', conversationId);
      io.in(participant.userId).socketsLeave(conversationId);
    }
  );

  appEvents.on('conversation:delete', ({ conversationId }) => {
    io.to(conversationId).emit('conversation:delete', conversationId);
    io.in(conversationId).socketsLeave(conversationId);
  });

  io.on('connection', async (socket) => {
    const userId = socket.user.id;
    socket.join(userId);

    const conversations =
      await conversationService.getUserConversations(userId);
    conversations.forEach((conv) => {
      socket.join(conv.id);
      // Online status
      socket.to(conv.id).emit('user:online', userId);
    });

    const onlineUserIds = new Set();

    for (const conv of conversations) {
      const sockets = await io.in(conv.id).fetchSockets();
      for (const s of sockets) {
        if (s.user.id !== userId) {
          onlineUserIds.add(s.user.id);
        }
      }
    }

    socket.emit('users:online', [...onlineUserIds]);

    socket.on(
      'message:send',
      handleSocketEvent(socket, async (conversationId, content, callback) => {
        if (typeof conversationId !== 'string' || typeof content !== 'string') {
          const error = new Error('Invalid message format.');
          error.statusCode = 400;
          throw error;
        }

        if (content.trim().length === 0) {
          const error = new Error('Message can not be empty.');
          error.statusCode = 400;
          throw error;
        }
        if (content.length > 2000) {
          const error = new Error('Message too long (max 2000 characters).');
          error.statusCode = 400;
          throw error;
        }

        const message = await conversationService.createMessage(
          'TEXT',
          conversationId,
          content,
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

    socket.on(
      'conversation:typing:start',
      handleSocketEvent(socket, (conversationId) => {
        socket
          .to(conversationId)
          .emit('conversation:typing:start', conversationId, socket.user.id);
      })
    );

    socket.on(
      'conversation:typing:stop',
      handleSocketEvent(socket, (conversationId) => {
        socket
          .to(conversationId)
          .emit('conversation:typing:stop', conversationId, socket.user.id);
      })
    );

    socket.on('disconnecting', async () => {
      const rooms = new Set(socket.rooms); // capture before await
      const sockets = await io.in(userId).fetchSockets();
      const isLastSocket = sockets.length === 1;

      for (const room of rooms) {
        if (room === socket.id || room === userId) continue;
        // Clear typing indicator
        socket.to(room).emit('conversation:typing:stop', room, socket.user.id);
        // Broadcast offline if this is the last socket
        if (isLastSocket) {
          socket.to(room).emit('user:offline', userId);
        }
      }
    });
  });
};

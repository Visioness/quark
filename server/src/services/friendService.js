import * as conversationService from './conversationService.js';
import * as userModel from '../models/userModel.js';
import * as friendModel from '../models/friendModel.js';
import { appEvents } from '../lib/events.js';

const getFriends = async (userId) => {
  return await friendModel.getFriends(userId);
};

const getFriendRequests = async (userId) => {
  return await friendModel.getPendingRequests(userId);
};

const sendFriendRequest = async (senderId, username) => {
  const receiver = await userModel.findUserByUsername(username);

  if (!receiver) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const existingFriendRequest = await friendModel.findAnyRequest(
    senderId,
    receiver.id
  );

  if (existingFriendRequest) {
    switch (existingFriendRequest.status) {
      case 'PENDING': {
        if (existingFriendRequest.receiverId === senderId) {
          const updatedRequest = await friendModel.acceptRequest(
            existingFriendRequest.id
          );
          await friendModel.addFriendship(senderId, receiver.id);

          const previousConversation =
            await conversationService.getPreviousConversation(
              senderId,
              receiver.id
            );

          if (!previousConversation) {
            const conversation = await conversationService.createConversation(
              senderId,
              receiver.id
            );

            appEvents.emit('conversation:created', {
              conversation,
              participantIds: [senderId, receiver.id],
            });
          }

          return updatedRequest;
        } else {
          const error = new Error(
            'You have already sent a friend request to that user.'
          );
          error.statusCode = 409;
          throw error;
        }
      }

      case 'ACCEPTED': {
        const error = new Error('You are already friends with that user.');
        error.statusCode = 409;
        throw error;
      }

      case 'REJECTED': {
        await friendModel.deleteRequest(existingFriendRequest.id);
        return await friendModel.sendRequest(senderId, receiver.id);
      }
    }
  }

  return await friendModel.sendRequest(senderId, receiver.id);
};

const acceptFriendRequest = async (senderId, receiverId) => {
  const sender = await userModel.findUserById(senderId);

  if (!sender) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const existingFriendRequest = await friendModel.findRequest(
    senderId,
    receiverId
  );

  if (!existingFriendRequest) {
    const error = new Error('Friend request not found.');
    error.statusCode = 404;
    throw error;
  }

  const updatedRequest = await friendModel.acceptRequest(
    existingFriendRequest.id
  );
  await friendModel.addFriendship(senderId, receiverId);

  const previousConversation =
    await conversationService.getPreviousConversation(senderId, receiverId);

  if (!previousConversation) {
    const conversation = await conversationService.createConversation(
      senderId,
      receiverId
    );

    appEvents.emit('conversation:created', {
      conversation,
      participantIds: [senderId, receiverId],
    });
  }

  return updatedRequest;
};

const rejectFriendRequest = async (senderId, receiverId) => {
  const sender = await userModel.findUserById(senderId);

  if (!sender) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const existingFriendRequest = await friendModel.findRequest(
    senderId,
    receiverId
  );

  if (!existingFriendRequest) {
    const error = new Error('Friend request not found.');
    error.statusCode = 404;
    throw error;
  }

  return await friendModel.rejectRequest(existingFriendRequest.id);
};

const removeFriend = async (userId, friendId) => {
  const friend = await userModel.findUserById(friendId);

  if (!friend) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const existingFriendship = await friendModel.findFriendship(userId, friendId);

  if (!existingFriendship) {
    const error = new Error('Friend not found.');
    error.statusCode = 404;
    throw error;
  }

  const friendRequest = await friendModel.findAnyRequest(userId, friend.id);
  if (friendRequest) {
    await friendModel.deleteRequest(friendRequest.id);
  }

  await friendModel.removeFriendship(userId, friend.id);

  return friend;
};

export {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
};

import * as userModel from '../models/userModel.js';
import * as friendModel from '../models/friendModel.js';

const getFriends = async (userId) => {
  return await friendModel.getFriends(userId);
};

const getFriendRequests = async (userId) => {
  return await friendModel.getPendingRequests(userId);
};

const sendFriendRequest = async (senderId, receiverUsername) => {
  const receiver = await userModel.findUserByUsername(receiverUsername);

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
    if (existingFriendRequest.status === 'PENDING') {
      if (existingFriendRequest.receiverId === senderId) {
        await friendModel.addFriendship(senderId, receiver.id);
        return await friendModel.acceptRequest(existingFriendRequest.id);
      } else {
        const error = new Error(
          'You have already sent a friend request to that user.'
        );
        error.statusCode = 409;
        throw error;
      }
    } else if (existingFriendRequest.status === 'ACCEPTED') {
      const error = new Error('You are already friends with that user.');
      error.statusCode = 409;
      throw error;
    } else {
      await friendModel.deleteRequest(existingFriendRequest.id);
    }
  }

  return await friendModel.sendRequest(senderId, receiver.id);
};

const acceptFriendRequest = async (senderUsername, receiverId) => {
  const sender = await userModel.findUserByUsername(senderUsername);

  if (!sender) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const existingFriendRequest = await friendModel.findRequest(
    sender.id,
    receiverId
  );

  if (!existingFriendRequest) {
    const error = new Error('Friend request not found.');
    error.statusCode = 404;
    throw error;
  }

  await friendModel.addFriendship(sender.id, receiverId);
  await friendModel.acceptRequest(existingFriendRequest.id);
};

const rejectFriendRequest = async (senderUsername, receiverId) => {
  const sender = await userModel.findUserByUsername(senderUsername);

  if (!sender) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const existingFriendRequest = await friendModel.findRequest(
    sender.id,
    receiverId
  );

  if (!existingFriendRequest) {
    const error = new Error('Friend request not found.');
    error.statusCode = 404;
    throw error;
  }

  await friendModel.rejectRequest(existingFriendRequest.id);
};

const removeFriend = async (userId, friendUsername) => {
  const friend = await userModel.findUserByUsername(friendUsername);

  if (!friend) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const existingFriendship = await friendModel.findFriendship(
    userId,
    friend.id
  );

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
};

export {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
};

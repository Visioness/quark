import * as friendService from '../services/friendService.js';

const getFriends = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const friends = await friendService.getFriends(userId);

    res.json({
      success: true,
      message: 'Successfully laoded the friends.',
      friends,
    });
  } catch (error) {
    next(error);
  }
};

const getFriendRequests = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const friendRequests = await friendService.getFriendRequests(userId);

    res.json({
      success: true,
      message: 'Successfully loaded the friend requests.',
      friendRequests,
    });
  } catch (error) {
    next(error);
  }
};

const sendFriendRequest = async (req, res, next) => {
  try {
    const receiverUsername = req.params.username;
    const senderId = req.user.userId;

    if (receiverUsername === req.user.username) {
      const error = new Error('Can not send request to yourself.');
      error.statusCode = 400;
      throw error;
    }

    const friendRequest = await friendService.sendFriendRequest(
      senderId,
      receiverUsername
    );

    let message = `Friend request sent to ${receiverUsername}.`;
    if (friendRequest.status === 'ACCEPTED') {
      message = `You are now friends with ${receiverUsername}.`;
    }

    res.json({
      success: true,
      message,
      friendRequest,
    });
  } catch (error) {
    next(error);
  }
};

const acceptFriendRequest = async (req, res, next) => {
  try {
    const senderUsername = req.params.username;
    const receiverId = req.user.userId;

    await friendService.acceptFriendRequest(senderUsername, receiverId);

    res.json({
      success: true,
      message: `You are now friends with ${senderUsername}.`,
    });
  } catch (error) {
    next(error);
  }
};

const rejectFriendRequest = async (req, res, next) => {
  try {
    const senderUsername = req.params.username;
    const receiverId = req.user.userId;

    await friendService.rejectFriendRequest(senderUsername, receiverId);

    res.json({
      success: true,
      message: `Rejected friend request from ${senderUsername}.`,
    });
  } catch (error) {
    next(error);
  }
};

const removeFriend = async (req, res, next) => {
  try {
    const friendUsername = req.params.username;
    const userId = req.user.userId;

    await friendService.removeFriend(userId, friendUsername);

    res.json({
      success: true,
      message: `Removed ${friendUsername} from friend list.`,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
};

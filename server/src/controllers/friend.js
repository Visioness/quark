import * as friendService from '../services/friendService.js';

const getFriends = async (req, res, next) => {
  try {
    const userId = req.user.id;

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
    const userId = req.user.id;

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
    const senderId = req.user.id;
    const { username } = req.params;

    if (username === req.user.username) {
      const error = new Error('Can not send request to yourself.');
      error.statusCode = 400;
      throw error;
    }

    const friendRequest = await friendService.sendFriendRequest(
      senderId,
      username
    );

    let message = `Friend request sent to ${friendRequest.receiver.username}.`;
    if (friendRequest.status === 'ACCEPTED') {
      message = `You are now friends with ${friendRequest.sender.username}.`;
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
    const receiverId = req.user.id;
    const { senderId } = req.params;

    const friendRequest = await friendService.acceptFriendRequest(
      senderId,
      receiverId
    );

    res.json({
      success: true,
      message: `You are now friends with ${friendRequest.sender.username}.`,
    });
  } catch (error) {
    next(error);
  }
};

const rejectFriendRequest = async (req, res, next) => {
  try {
    const receiverId = req.user.id;
    const { senderId } = req.params;

    const friendRequest = await friendService.rejectFriendRequest(
      senderId,
      receiverId
    );

    res.json({
      success: true,
      message: `Rejected friend request from ${friendRequest.sender.username}.`,
    });
  } catch (error) {
    next(error);
  }
};

const removeFriend = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    const friend = await friendService.removeFriend(userId, friendId);

    res.json({
      success: true,
      message: `Removed ${friend.username} from friend list.`,
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

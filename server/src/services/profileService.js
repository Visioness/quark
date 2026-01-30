import * as userModel from '../models/userModel.js';

const getUserProfile = async (username, currentUser) => {
  const user = await userModel.findUserByUsername(username);

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const { id, password, ...profile } = user;
  if (currentUser) {
    return profile;
  } else {
    return {
      username: profile.username,
      createdAt: profile.createdAt,
    };
  }
};

export { getUserProfile };

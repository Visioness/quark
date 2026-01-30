import * as profileService from '../services/profileService.js';

const getProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const currentUser = username === req.user.username;
    const profile = await profileService.getUserProfile(username, currentUser);

    res.json({
      success: true,
      message: 'Successfully loaded the profile.',
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export { getProfile };

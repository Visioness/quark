import { matchedData } from 'express-validator';
import * as groupService from '../services/groupService.js';

const createGroup = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { groupName } = matchedData(req);

    const group = await groupService.createGroup(groupName, userId);

    res.status(201).json({
      success: true,
      message: 'Successfully created the group.',
      group,
    });
  } catch (error) {
    next(error);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { groupId } = req.params;

    await groupService.deleteGroup(groupId, userId);

    res.json({
      success: true,
      message: 'Successfully deleted the group.',
    });
  } catch (error) {
    next(error);
  }
};

const leaveGroup = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { groupId } = req.params;

    await groupService.leaveGroup(groupId, userId);

    res.json({
      success: true,
      message: 'Successfully left the group.',
    });
  } catch (error) {
    next(error);
  }
};

const transferOwnership = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { groupId, newOwnerId } = req.params;

    if (userId === newOwnerId) {
      const error = new Error('You can only transfer to other members.');
      error.statusCode = 409;
      throw error;
    }

    const [_, newOwner] = await groupService.transferOwnership(
      groupId,
      userId,
      newOwnerId
    );

    res.json({
      success: true,
      message: `Successfully transferred the ownership.`,
      newOwner,
    });
  } catch (error) {
    next(error);
  }
};

export { createGroup, deleteGroup, leaveGroup, transferOwnership };

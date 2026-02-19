import { matchedData } from 'express-validator';
import * as inviteService from '../services/inviteService.js';

const getAllInvites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { groupId } = req.params;

    const invites = await inviteService.getAllInvites(groupId, userId);

    res.json({
      success: true,
      message: 'Successfully loaded the invites.',
      invites,
    });
  } catch (error) {
    next(error);
  }
};

const createInvite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { groupId } = req.params;
    const { duration } = matchedData(req);

    const invite = await inviteService.createInvite(groupId, userId, duration);

    res.status(201).json({
      success: true,
      message: 'Successfully created the invite.',
      invite,
    });
  } catch (error) {
    next(error);
  }
};

const deleteInvite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { inviteCode } = req.params;

    await inviteService.deleteInvite(inviteCode, userId);

    res.json({
      success: true,
      message: 'Successfully deleted the invite',
    });
  } catch (error) {
    next(error);
  }
};

const joinViaInvite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { inviteCode } = req.params;

    const conversation = await inviteService.joinViaInvite(inviteCode, userId);

    res.json({
      success: true,
      message: 'Successfully joined the group.',
      conversationId: conversation.id,
    });
  } catch (error) {
    next(error);
  }
};

export { getAllInvites, createInvite, deleteInvite, joinViaInvite };

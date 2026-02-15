import { matchedData } from 'express-validator';
import * as conversationService from '../services/conversationService.js';

const getConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await conversationService.getConversation(
      conversationId,
      userId
    );

    res.json({
      success: true,
      message: 'Successfully loaded the conversation.',
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

const getUserConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const conversations = await conversationService.getUserConversations(
      userId
    );

    res.json({
      success: true,
      message: 'Successfully loaded the user conversations.',
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const { cursor, limit } = matchedData(req);

    const result = await conversationService.getMessages(
      conversationId,
      userId,
      { cursor, limit }
    );

    res.json({
      success: true,
      message: 'Successfully loaded the messages',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const createConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    const conversation = await conversationService.createConversation(
      userId,
      friendId
    );

    res.json({
      success: true,
      message: 'Successfully created the conversation.',
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getConversation,
  getUserConversations,
  getMessages,
  createConversation,
};

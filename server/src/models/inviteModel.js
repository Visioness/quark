import { prisma } from '../lib/prisma.js';

const getAllInvites = async (groupId) => {
  return await prisma.groupInviteLink.findMany({
    where: { conversationId: groupId },
    select: {
      code: true,
      createdAt: true,
      expiresAt: true,
      creator: { select: { username: true } },
    },
  });
};

const createInvite = async (groupId, userId, expiresAt) => {
  return await prisma.groupInviteLink.create({
    data: {
      conversationId: groupId,
      createdBy: userId,
      expiresAt,
    },
  });
};

const getInvite = async (code) => {
  return await prisma.groupInviteLink.findUnique({
    where: { code },
  });
};

const deleteInvite = async (code) => {
  return await prisma.groupInviteLink.delete({
    where: { code },
  });
};

export { getAllInvites, createInvite, getInvite, deleteInvite };

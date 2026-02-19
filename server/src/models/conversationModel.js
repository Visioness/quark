import { prisma } from '../lib/prisma.js';

const conversationInclude = {
  participants: {
    select: {
      userId: true,
      role: true,
      lastReadAt: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  },
  messages: {
    take: 1,
    orderBy: { createdAt: 'desc' },
  },
};

const getConversation = async (conversationId) => {
  return await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: conversationInclude,
  });
};

const getGroup = async (groupName, ownerId) => {
  return await prisma.conversation.findUnique({
    where: {
      ownerId_name: { name: groupName, ownerId },
    },
  });
};

const getPreviousConversation = async (userId, friendId) => {
  return await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: userId } } },
        { participants: { some: { userId: friendId } } },
      ],
    },
  });
};

const getUserConversations = async (userId) => {
  return await prisma.conversation.findMany({
    where: {
      participants: { some: { userId } },
    },
    orderBy: { lastMessageAt: 'desc' },
    include: {
      messages: {
        take: 1,
        orderBy: {
          createdAt: 'desc',
        },
      },
      participants: {
        select: {
          userId: true,
          lastReadAt: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });
};

const updateLastMessageAt = async (conversationId) => {
  return await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });
};

const getMessages = async (conversationId, { cursor, limit = 30 }) => {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    include: { sender: { select: { username: true } } },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = messages.length > limit;
  if (hasMore) messages.pop();

  return {
    messages: messages.reverse(),
    nextCursor: hasMore ? messages[0]?.id : null,
  };
};

const createDM = async (userId, friendId) => {
  return await prisma.conversation.create({
    data: {
      participants: {
        create: [{ userId: userId }, { userId: friendId }],
      },
    },
    include: conversationInclude,
  });
};

const createGroup = async (groupName, userId) => {
  return await prisma.conversation.create({
    data: {
      type: 'GROUP',
      name: groupName,
      ownerId: userId,
      participants: {
        create: [{ userId, role: 'OWNER' }],
      },
    },
    include: conversationInclude,
  });
};

const createMessage = async (conversationId, content, senderId) => {
  return await prisma.message.create({
    data: { conversationId, content, senderId },
    include: { sender: { select: { username: true } } },
  });
};

const verifyConversation = async (conversationId) => {
  return await prisma.conversation.findUnique({
    where: { id: conversationId },
  });
};

const verifyParticipant = async (conversationId, userId) => {
  return await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
};

const joinGroup = async (conversationId, userId) => {
  return await prisma.conversationParticipant.create({
    data: {
      conversationId,
      userId,
    },
    include: {
      conversation: {
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      },
    },
  });
};

const leaveGroup = async (conversationId, userId) => {
  return await prisma.conversationParticipant.delete({
    where: { conversationId_userId: { conversationId, userId } },
  });
};

const deleteGroup = async (conversationId) => {
  return await prisma.conversation.delete({
    where: { id: conversationId },
  });
};

const transferOwnership = async (conversationId, previousId, nextId) => {
  return await prisma.$transaction([
    prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId: previousId } },
      data: { role: 'MEMBER' },
    }),
    prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId: nextId } },
      data: { role: 'OWNER' },
    }),
  ]);
};

const getUnreadCounts = async (conversationIds, userId) => {
  return await prisma.$queryRaw`
    SELECT m."conversationId", COUNT(*)::int as unread
    FROM "Message" m
    JOIN "ConversationParticipant" cp
      ON cp."conversationId" = m."conversationId"
      AND cp."userId" = ${userId}
    WHERE m."senderId" != ${userId}
      AND m."createdAt" > cp."lastReadAt"
      AND m."conversationId" = ANY(${conversationIds})
    GROUP BY m."conversationId"
  `;
};

const markAsRead = async (conversationId, userId) => {
  return await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: { conversationId, userId },
    },
    data: {
      lastReadAt: new Date(),
    },
  });
};

export {
  getConversation,
  getGroup,
  getPreviousConversation,
  getUserConversations,
  updateLastMessageAt,
  getMessages,
  getUnreadCounts,
  createDM,
  createGroup,
  createMessage,
  verifyParticipant,
  verifyConversation,
  joinGroup,
  leaveGroup,
  deleteGroup,
  transferOwnership,
  markAsRead,
};

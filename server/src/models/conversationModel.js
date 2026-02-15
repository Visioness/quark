import { prisma } from '../lib/prisma.js';

const conversationInclude = {
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
};

const getConversation = async (conversationId) => {
  return await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: conversationInclude,
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

const getMessages = async (conversationId, { cursor, limit = 30 }) => {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
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

const getParticipant = async (conversationId, userId) => {
  return await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
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

const createConversation = async (userId, friendId) => {
  return await prisma.conversation.create({
    data: {
      participants: {
        create: [{ userId: userId }, { userId: friendId }],
      },
    },
    include: conversationInclude,
  });
};

const createMessage = async (conversationId, content, senderId) => {
  return await prisma.message.create({
    data: {
      conversationId,
      content,
      senderId,
    },
  });
};

const markAsRead = async (conversationId, userId) => {
  return await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
    data: {
      lastReadAt: new Date(),
    },
  });
};

export {
  getConversation,
  getPreviousConversation,
  getUserConversations,
  getMessages,
  getParticipant,
  getUnreadCounts,
  createConversation,
  createMessage,
  markAsRead,
};

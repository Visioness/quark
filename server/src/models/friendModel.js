import { prisma } from '../lib/prisma.js';

const getFriends = async (id) => {
  const data = await prisma.user.findUnique({
    where: { id },
    select: {
      friends: {
        select: {
          id: true,
          username: true,
        },
        orderBy: {
          username: 'asc',
        },
      },
    },
  });

  return data.friends;
};

const getPendingRequests = async (receiverId) => {
  return await prisma.friendRequest.findMany({
    where: {
      receiverId,
      status: 'PENDING',
    },
    include: {
      sender: {
        select: {
          username: true,
        },
      },
    },
  });
};

const findRequest = async (senderId, receiverId) => {
  return await prisma.friendRequest.findUnique({
    where: {
      senderId_receiverId: {
        senderId,
        receiverId,
      },
    },
  });
};

const findAnyRequest = async (firstId, secondId) => {
  return await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId: firstId, receiverId: secondId },
        { senderId: secondId, receiverId: firstId },
      ],
    },
  });
};

const sendRequest = async (senderId, receiverId) => {
  return await prisma.friendRequest.create({
    data: {
      senderId,
      receiverId,
    },
    select: {
      sender: {
        select: {
          username: true,
        },
      },
      receiver: {
        select: {
          username: true,
        },
      },
    },
  });
};

const acceptRequest = async (id) => {
  return await prisma.friendRequest.update({
    where: {
      id,
    },
    data: {
      status: 'ACCEPTED',
    },
    select: {
      sender: {
        select: {
          username: true,
        },
      },
      receiver: {
        select: {
          username: true,
        },
      },
    },
  });
};

const rejectRequest = async (id) => {
  return await prisma.friendRequest.update({
    where: {
      id,
    },
    data: {
      status: 'REJECTED',
    },
    select: {
      sender: {
        select: {
          username: true,
        },
      },
      receiver: {
        select: {
          username: true,
        },
      },
    },
  });
};

const deleteRequest = async (id) => {
  return await prisma.friendRequest.delete({
    where: {
      id,
    },
  });
};

const addFriendship = async (userId, friendId) => {
  await prisma.user.update({
    where: {
      id: friendId,
    },
    data: {
      friends: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      friends: {
        connect: {
          id: friendId,
        },
      },
    },
  });
};

const findFriendship = async (userId, friendId) => {
  return await prisma.user.findFirst({
    where: {
      id: userId,
      friends: {
        some: {
          id: friendId,
        },
      },
    },
  });
};

const removeFriendship = async (userId, friendId) => {
  await prisma.user.update({
    where: {
      id: friendId,
    },
    data: {
      friends: {
        disconnect: {
          id: userId,
        },
      },
    },
  });

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      friends: {
        disconnect: {
          id: friendId,
        },
      },
    },
  });
};

export {
  getFriends,
  getPendingRequests,
  findRequest,
  findAnyRequest,
  sendRequest,
  acceptRequest,
  rejectRequest,
  deleteRequest,
  addFriendship,
  findFriendship,
  removeFriendship,
};

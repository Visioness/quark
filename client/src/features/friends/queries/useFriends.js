import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptFriendRequest,
  getFriendRequests,
  getFriends,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from '@/services/friend.service';
import { friendKeys } from './keys';

export const useFriendList = () => {
  return useQuery({
    queryKey: friendKeys.list(),
    queryFn: () => getFriends(),
  });
};

export const useFriendRequests = () => {
  return useQuery({
    queryKey: friendKeys.requests(),
    queryFn: () => getFriendRequests(),
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (senderId) => acceptFriendRequest(senderId),

    onMutate: async (senderId) => {
      await queryClient.cancelQueries({ queryKey: friendKeys.requests() });
      await queryClient.cancelQueries({ queryKey: friendKeys.list() });

      const previousRequests = queryClient.getQueryData(friendKeys.requests());
      const previousFriends = queryClient.getQueryData(friendKeys.list());

      const acceptedRequest = previousRequests?.friendRequests?.find(
        (req) => req.senderId === senderId
      );

      queryClient.setQueryData(friendKeys.requests(), (old) => ({
        ...old,
        friendRequests: old.friendRequests.filter(
          (req) => req.senderId !== senderId
        ),
      }));

      if (acceptFriendRequest) {
        queryClient.setQueryData(friendKeys.list(), (old) => {
          const newFriend = {
            id: acceptedRequest.senderId,
            username: acceptedRequest.sender.username,
          };
          return old ? [...old, newFriend] : [newFriend];
        });
      }

      return { previousRequests, previousFriends };
    },

    onError: (err, senderId, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(
          friendKeys.requests(),
          context.previousRequests
        );
      }
      if (context?.previousFriends) {
        queryClient.setQueryData(friendKeys.list(), context.previousFriends);
      }
      console.error('Failed to accept friend requests: ', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.requests() });
      queryClient.invalidateQueries({ queryKey: friendKeys.list() });
    },
  });
};

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (senderId) => rejectFriendRequest(senderId),

    onMutate: async (senderId) => {
      await queryClient.cancelQueries({ queryKey: friendKeys.requests() });

      const previousRequests = queryClient.getQueryData(friendKeys.requests());

      queryClient.setQueryData(friendKeys.requests(), (old) => ({
        ...old,
        friendRequests: old.friendRequests.filter(
          (req) => req.senderId !== senderId
        ),
      }));

      return { previousRequests };
    },

    onError: (err, senderId, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(
          friendKeys.requests(),
          context.previousRequests
        );
      }
      console.error('Failed to reject friend requests: ', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.requests() });
    },
  });
};

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendId) => removeFriend(friendId),

    onMutate: async (friendId) => {
      await queryClient.cancelQueries({ queryKey: friendKeys.list() });

      const previousFriends = queryClient.getQueryData(friendKeys.list());

      queryClient.setQueryData(friendKeys.list(), (old) => ({
        ...old,
        friends: old?.friends?.filter((friend) => friend.id !== friendId) ?? [],
      }));

      return { previousFriends };
    },

    onError: (err, friendId, context) => {
      if (context?.previousFriends) {
        queryClient.setQueryData(friendKeys.list(), context.previousFriends);
      }
      console.error('Failed to remove friend: ', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.list() });
    },
  });
};

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username) => sendFriendRequest(username),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.requests() });
    },

    onError: (err) => {
      console.error('Failed to send friend request: ', err);
    },
  });
};

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '@/socket';
import { useAuth } from '@/features/auth/context';
import { useSocketEvents } from '@/features/chat/hooks';
import { conversationKeys } from '@/features/chat/queries/useConversations';

const SocketContext = createContext({
  socket: null,
  isConnected: false,
  changeConversation: () => {},
  onlineUsers: new Set(),
});

export const SocketProvider = ({ children }) => {
  const { accessToken, refreshtoken } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const activeConversationRef = useRef(null);
  const refreshRef = useRef(refreshtoken);

  useEffect(() => {
    refreshRef.current = refreshtoken;
  }, [refreshtoken]);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // Socket lifecycle: connect/disconnect/auth
  useEffect(() => {
    if (!accessToken) {
      socket.disconnect();
      return;
    }

    socket.auth = { token: accessToken };

    const onConnect = () => setIsConnected(true);
    const onError = (err) => console.error('Socket server error:', err.message);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('error:server', onError);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('error:server', onError);
      socket.disconnect();
    };
  }, [accessToken]);

  // Handle connection errors & token refresh
  useEffect(() => {
    const onConnectError = async (error) => {
      console.error('Socket connection error: ', error.message);

      if (error.message === 'Token expired.') {
        try {
          await refreshRef.current();
          return;
        } catch {
          // Fall through to disconnect
        }
      }

      socket.disconnect();
    };

    socket.on('connect_error', onConnectError);
    return () => socket.off('connect_error', onConnectError);
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const onInitial = (userIds) => {
      setOnlineUsers((prev) => new Set([...prev, ...userIds]));
    };

    const onUserOnline = (userId) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    };

    const onUserOffline = (userId) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

    socket.on('users:online', onInitial);
    socket.on('user:online', onUserOnline);
    socket.on('user:offline', onUserOffline);

    return () => {
      socket.off('users:online', onInitial);
      socket.off('user:online', onUserOnline);
      socket.off('user:offline', onUserOffline);
    };
  }, [accessToken]);

  // Fetch conversations into React Query cache when connected
  useEffect(() => {
    if (!accessToken) return;

    queryClient.invalidateQueries({
      queryKey: conversationKeys.list(),
    });
  }, [accessToken, queryClient]);

  // Centralized socket event handlers (updates React Query cache)
  useSocketEvents(socket, isConnected, activeConversationRef);

  const changeConversation = useCallback(
    (id) => {
      setActiveConversation(id);
      if (id) {
        // Reset unread for the conversation being opened
        queryClient.setQueryData(conversationKeys.list(), (old) => {
          if (!Array.isArray(old)) return old;
          return old.map((conv) =>
            conv.id === id ? { ...conv, unread: 0 } : conv
          );
        });
      }
    },
    [queryClient]
  );

  const value = useMemo(
    () => ({
      socket,
      isConnected,
      activeConversation,
      changeConversation,
      onlineUsers,
    }),
    [isConnected, activeConversation, changeConversation, onlineUsers]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

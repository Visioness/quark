import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { socket } from '@/socket';
import { useAuth } from '@/features/auth/context';
import { getUserConversations } from '@/services/conversation.service';

const SocketContext = createContext({
  socket: null,
  isConnected: false,
  conversations: [],
});

export const SocketProvider = ({ children }) => {
  const { accessToken, refreshtoken } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const activeConversationRef = useRef(null);
  const refreshRef = useRef(refreshtoken);

  useEffect(() => {
    refreshRef.current = refreshtoken;
  }, [refreshtoken]);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    const fetchConversations = async () => {
      const result = await getUserConversations(accessToken);
      setConversations(result.success ? result.conversations : []);
    };
    fetchConversations();
  }, [accessToken]);

  const updateConversationOnMessage = useCallback((message) => {
    const id = message.conversationId;
    setConversations((prev) => {
      const existing = prev.find((conv) => conv.id === id);
      if (!existing) return prev;

      const rest = prev.filter((conv) => conv.id !== id);
      const isActive = activeConversationRef.current === id;

      return [
        {
          ...existing,
          unread: isActive ? 0 : (existing.unread || 0) + 1,
          messages: [message],
        },
        ...rest,
      ];
    });
  }, []);

  useEffect(() => {
    if (!accessToken) {
      socket.disconnect();
      return;
    }

    socket.auth = { token: accessToken };

    const onConnect = () => setIsConnected(true);
    const onError = (err) => console.error('Socket server error:', err.message);
    const onDisconnect = () => setIsConnected(false);
    const onMessage = (message) => updateConversationOnMessage(message);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('error:server', onError);
    socket.on('message:receive', onMessage);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('error:server', onError);
      socket.off('message:receive', onMessage);
      socket.disconnect();
    };
  }, [accessToken, updateConversationOnMessage]);

  useEffect(() => {
    const onConnectError = async (error) => {
      console.error('Socket connection error: ', error.message);

      if (error.message === 'Token expired.') {
        const result = await refreshToken();
        if (result?.success) {
          return;
        }
      }

      socket.disconnect();
    };

    socket.on('connect_error', onConnectError);
    return () => socket.off('connect_error', onConnectError);
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    const onNewConversation = (conversation) => {
      setConversations((prev) => {
        if (prev.some((c) => c.id === conversation.id)) return prev;
        return [{ ...conversation, unread: 0 }, ...prev];
      });
    };

    socket.on('conversation:new', onNewConversation);
    return () => socket.off('conversation:new', onNewConversation);
  }, [isConnected]);

  const changeConversation = useCallback((id) => {
    setActiveConversation(id);
    if (id) {
      setConversations((prev) =>
        prev.map((conv) => (conv.id === id ? { ...conv, unread: 0 } : conv))
      );
    }
  }, []);

  const findPrivateConversation = useCallback(
    (friendId) => {
      return conversations.find(
        (conv) =>
          conv.type === 'PRIVATE' &&
          conv.participants.some((p) => p.userId === friendId)
      )?.id;
    },
    [conversations]
  );

  const value = useMemo(
    () => ({
      socket,
      isConnected,
      conversations,
      changeConversation,
      findPrivateConversation,
      updateConversationOnMessage,
    }),
    [
      isConnected,
      conversations,
      changeConversation,
      findPrivateConversation,
      updateConversationOnMessage,
    ]
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

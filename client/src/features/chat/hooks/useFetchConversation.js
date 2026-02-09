import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context';
import { getConversation } from '@/services/conversation.service';

export const useFetchConversation = (conversationId) => {
  const { accessToken } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentId, setCurrentId] = useState(conversationId);

  // Reset state during render when conversationId changes (not inside an effect)
  if (conversationId !== currentId) {
    setCurrentId(conversationId);
    setConversation(null);
    setError(null);
    setLoading(true);
  }

  useEffect(() => {
    let ignore = false;

    getConversation(conversationId, accessToken)
      .then((result) => {
        if (ignore) return;
        setConversation(result.conversation);
      })
      .catch((err) => {
        if (!ignore) setError(err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [conversationId, accessToken]);

  return { conversation, setConversation, loading, error };
};

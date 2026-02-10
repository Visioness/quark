import { useEffect, useState } from 'react';
import { getConversation } from '@/services/conversation.service';

export const useFetchConversation = (conversationId) => {
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

    getConversation(conversationId)
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
  }, [conversationId]);

  return { conversation, setConversation, loading, error };
};

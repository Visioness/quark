import { useMemo, useRef } from 'react';
import { useFetchMessages } from '../queries/useConversations';
import { getMessagesFromInfiniteData } from '../queries/messageCacheHelpers';
import { LoadingSpinner } from '@/components/ui';
import { useInfiniteScrollTop, useScrollPositionPreserver } from '../hooks';

export const MessageList = ({ conversationId, currentUserId }) => {
  const { data, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage } =
    useFetchMessages(conversationId);

  const messages = useMemo(() => getMessagesFromInfiniteData(data), [data]);
  const chatRef = useRef(null);
  const topSentinelRef = useInfiniteScrollTop(
    chatRef,
    hasPreviousPage,
    fetchPreviousPage
  );
  const handleScroll = useScrollPositionPreserver(chatRef, messages);

  return (
    <main
      ref={chatRef}
      onScroll={handleScroll}
      className='flex-1 p-2 overflow-y-auto'>
      <div ref={topSentinelRef}>
        {isFetchingPreviousPage && <LoadingSpinner size='sm' />}
      </div>

      <ul className='messages h-full px-4 py-8 space-y-4'>
        {messages.map((message) => (
          <li
            key={message.id}
            className={`message flex flex-col gap-1 ${
              message.senderId === currentUserId ? 'items-end' : 'items-start'
            }`}>
            <div
              className={`content px-4 py-2 max-w-[50%] rounded-xl border whitespace-pre-wrap ${
                message.senderId === currentUserId
                  ? message?._status === 'sending'
                    ? 'bg-muted text-muted-foreground border-border'
                    : 'bg-primary/50 text-primary-foreground border-primary'
                  : 'bg-card text-card-foreground border-border'
              }`}>
              {message.content}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

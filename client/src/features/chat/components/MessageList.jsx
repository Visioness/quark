import { useMemo, useRef } from 'react';
import { useFetchMessages } from '../queries/useConversations';
import { getMessagesFromInfiniteData } from '../queries/messageCacheHelpers';
import { LoadingSpinner } from '@/components/ui';
import { useInfiniteScrollTop, useScrollPositionPreserver } from '../hooks';

export const MessageList = ({ conversationId, currentUserId, isGroup }) => {
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
            {isGroup && (
              <span className='translate-y-1 username text-sm font-bold text-card-foreground/70'>
                {message.sender.username}
              </span>
            )}
            <p
              lang='en'
              className={`content px-4 py-2 w-fit max-w-[85%] sm:max-w-[75%] border whitespace-pre-wrap wrap-anywhere ${
                message.senderId === currentUserId
                  ? message?._status === 'sending'
                    ? 'bg-muted text-muted-foreground border-border rounded-b-xl rounded-tr-sm rounded-tl-xl'
                    : 'bg-primary/50 text-primary-foreground border-primary rounded-b-xl rounded-tr-sm rounded-tl-xl'
                  : 'bg-card text-card-foreground border-border rounded-b-xl rounded-tr-xl rounded-tl-sm'
              }`}>
              {message.content}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
};

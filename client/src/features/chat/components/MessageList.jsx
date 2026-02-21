import { useMemo, useRef } from 'react';
import { useFetchMessages } from '@/features/chat/queries/useConversations';
import { getMessagesFromInfiniteData } from '@/features/chat/queries/messageCacheHelpers';
import { LoadingSpinner } from '@/components/ui';
import {
  useInfiniteScrollTop,
  useScrollPositionPreserver,
} from '@/features/chat/hooks';
import { Message } from '@/features/chat/components';

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
        {messages.reduce((acc, message, index) => {
          const currentDate = new Date(message.createdAt).toLocaleDateString(
            undefined,
            {
              month: 'long',
              year: 'numeric',
              day: 'numeric',
            }
          );
          const previousDate =
            index > 0
              ? new Date(messages[index - 1].createdAt).toLocaleDateString(
                  undefined,
                  {
                    month: 'long',
                    year: 'numeric',
                    day: 'numeric',
                  }
                )
              : null;

          if (currentDate !== previousDate) {
            acc.push(
              <li
                key={`date-${message.id}`}
                className='relative flex justify-center my-4'>
                <hr className='absolute top-1/2 z-10 w-full border-dashed border-border' />
                <span className='relative z-20 text-xs font-semibold text-card-foreground/80 bg-card px-3 py-1 rounded-full border border-border'>
                  {currentDate}
                </span>
              </li>
            );
          }

          acc.push(
            <Message
              key={message.id}
              message={message}
              isGroupMessage={isGroup}
              currentUserId={currentUserId}
            />
          );

          return acc;
        }, [])}
      </ul>
    </main>
  );
};

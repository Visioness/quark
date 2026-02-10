import { useLayoutEffect, useRef } from 'react';

export const MessageList = ({ messages, currentUserId }) => {
  const chatRef = useRef(null);

  useLayoutEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main ref={chatRef} className='flex-1 p-2 overflow-y-auto'>
      <ul className='messages h-full px-4 py-8 space-y-4'>
        {messages.map((message) => (
          <li
            key={message.id}
            className={`message flex flex-col gap-1 ${
              message.senderId === currentUserId ? 'items-end' : 'items-start'
            }`}>
            <div
              className={`content px-4 py-2 max-w-[50%] rounded-xl border ${
                message.senderId === currentUserId
                  ? 'bg-primary/50 text-primary-foreground border-primary'
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

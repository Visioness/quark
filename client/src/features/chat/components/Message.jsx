import {
  MessageContent,
  MessageSender,
  MessageTimestamp,
} from '@/features/chat/components';

export const Message = ({ message, isGroupMessage, currentUserId }) => {
  const sentByUser = message.senderId === currentUserId;

  return message.type === 'USER_JOINED' || message.type === 'USER_LEFT' ? (
    <li key={message.id} className='message flex justify-center'>
      <p className='text-xs text-muted-foreground italic space-x-2'>
        <span className='font-semibold text-card-foreground/80'>
          {message.sender.username}
        </span>
        <span>{message.content}</span>
      </p>
    </li>
  ) : (
    <li
      key={message.id}
      className={`message flex flex-col gap-1 ${
        sentByUser ? 'items-end' : 'items-start'
      }`}>
      {isGroupMessage && <MessageSender sender={message.sender} />}
      <div
        className={`w-full flex items-center gap-1 ${
          sentByUser ? 'flex-row-reverse' : ''
        }`}>
        <MessageTimestamp
          timestamp={message.createdAt}
          sentByUser={sentByUser}
        />
        <MessageContent
          content={message.content}
          status={message?._status}
          sentByUser={sentByUser}
        />
      </div>
    </li>
  );
};

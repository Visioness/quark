export const LastMessage = ({ messages, unread }) => {
  const lastMessage = messages.length > 0 ? messages[0] : null;
  const isUnread = unread > 0;

  const getMessageContent = () => {
    if (!lastMessage) return '';

    switch (lastMessage.type) {
      case 'TEXT':
        return lastMessage.content;
      case 'USER_JOINED':
        return `${lastMessage.sender?.username || 'Someone'} joined the chat.`;
      case 'USER_LEFT':
        return `${lastMessage.sender?.username || 'Someone'} left the chat.`;
      default:
        return lastMessage.content;
    }
  };

  return (
    <p
      className={`text-xs text-muted-foreground truncate ${
        isUnread ? 'text-secondary-foreground' : 'text-muted-foreground'
      }`}>
      {getMessageContent()}
    </p>
  );
};

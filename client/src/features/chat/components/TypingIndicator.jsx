export const TypingIndicator = ({
  typingUsers,
  conversation,
  currentUserId,
}) => {
  const othersTyping = typingUsers.filter((id) => id !== currentUserId);

  const typingNames = othersTyping.map((userId) => {
    const participant = conversation.participants.find(
      (p) => p.userId === userId
    );
    return participant?.user?.username || 'Someone';
  });

  const getTypingText = () => {
    if (typingNames.length === 1) {
      return `${typingNames[0]} is typing`;
    } else if (typingNames.length === 2) {
      return `${typingNames[0]} and ${typingNames[1]} are typing`;
    } else if (typingNames.length === 3) {
      return `${typingNames[0]}, ${typingNames[1]}, and ${typingNames[2]} are typing`;
    } else {
      return `${typingNames[0]}, ${typingNames[1]}, and ${
        typingNames.length - 2
      } others are typing`;
    }
  };

  return (
    <div className='px-4 min-h-6 font-bold text-muted-foreground flex items-center gap-2'>
      {othersTyping.length > 0 && (
        <>
          <span className='ml-4 text-xs'>{getTypingText()}</span>
          <span className='flex gap-1'>
            <span
              className='animate-ping-bounce'
              style={{ animationDelay: '0ms' }}>
              •
            </span>
            <span
              className='animate-ping-bounce'
              style={{ animationDelay: '150ms' }}>
              •
            </span>
            <span
              className='animate-ping-bounce'
              style={{ animationDelay: '300ms' }}>
              •
            </span>
          </span>
        </>
      )}
    </div>
  );
};

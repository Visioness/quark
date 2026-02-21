export const MessageSender = ({ sender }) => {
  return (
    <span className='px-8 translate-y-1 username text-sm font-bold text-card-foreground/70'>
      {sender.username}
    </span>
  );
};

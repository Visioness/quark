export const MessageContent = ({ content, status, sentByUser }) => {
  return (
    <p
      lang='en'
      className={`content px-4 py-2 w-fit max-w-[85%] sm:max-w-[75%] border whitespace-pre-wrap wrap-anywhere ${
        sentByUser
          ? status === 'sending'
            ? 'bg-muted text-muted-foreground border-border rounded-b-xl rounded-tr-sm rounded-tl-xl'
            : 'bg-primary/50 text-primary-foreground border-primary rounded-b-xl rounded-tr-sm rounded-tl-xl'
          : 'bg-card text-card-foreground border-border rounded-b-xl rounded-tr-xl rounded-tl-sm'
      }`}>
      {content}
    </p>
  );
};

export const MessageTimestamp = ({ timestamp, sentByUser }) => {
  return (
    <span
      className={`text-[10px] font-semibold text-foreground/70 bottom-0 ${
        sentByUser ? '-left-7' : '-right-8'
      }`}>
      {new Date(timestamp).toLocaleTimeString().slice(0, 5)}
    </span>
  );
};

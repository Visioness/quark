export const ConversationName = ({ user, type, groupName, participants }) => {
  const name =
    (type === 'GROUP' && groupName) ||
    participants.filter((participant) => participant.userId != user.id)[0].user
      .username;
  return (
    <span className='text-sm font-semibold truncate text-secondary-foreground'>
      {name}
    </span>
  );
};

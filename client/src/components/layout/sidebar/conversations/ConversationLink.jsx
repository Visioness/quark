import { PageLink } from '@/components/ui';

export const ConversationLink = ({ to, onClick, children }) => {
  return (
    <PageLink
      to={to}
      onClick={onClick}
      extra='flex items-center gap-4 justify-around'>
      {children}
    </PageLink>
  );
};

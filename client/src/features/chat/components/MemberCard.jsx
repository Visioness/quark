import { UserRound } from 'lucide-react';

export const MemberCard = ({ participant }) => {
  const roleBadgeStyle = () => {
    switch (participant.role) {
      case 'OWNER':
        return 'bg-violet-800/30 border-violet-600 text-violet-300';
      case 'ADMIN':
        return 'bg-rose-800/30 border-rose-600 text-rose-300';
      default:
        return 'bg-slate-800/30 border-slate-600 text-slate-300';
    }
  };

  return (
    <li className='p-2 grid grid-rows-2 grid-cols-[auto_1fr] items-center gap-x-4 rounded-xl hover:bg-sidebar-accent/50 active:bg-sidebar-accent cursor-pointer'>
      <div className='relative flex justify-center items-center row-span-2 size-10 rounded-full border bg-primary/10 border-primary/20 text-primary'>
        <UserRound />
        <div
          className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-card ${participant.online ? 'bg-emerald-600' : 'bg-slate-600'}`}></div>
      </div>
      <span className='text-sm font-semibold text-card-foreground truncate'>
        {participant.user.username}
      </span>
      <div
        className={`text-[10px] w-max px-2 border rounded-full lowercase font-bold ${roleBadgeStyle()}`}>
        {participant.role}
      </div>
    </li>
  );
};

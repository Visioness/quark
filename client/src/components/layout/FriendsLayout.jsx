import { NavLink, Outlet, useLocation } from 'react-router';

export const FriendsLayout = () => {
  const location = useLocation();
  const isFriendsPath = location.pathname === '/friends';

  return (
    <div className='friends-layout w-full h-full flex flex-col'>
      <div className='w-full py-6 flex justify-center'>
        <nav className='relative flex items-center p-1 bg-muted/50 rounded-full border border-border/40'>
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-background shadow-sm border border-border/20 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
              isFriendsPath
                ? 'translate-x-0 left-1'
                : 'translate-x-full left-[3px]'
            }`}
          />
          <NavLink
            to='/friends'
            end
            className={({ isActive }) =>
              `relative z-20 w-32 sm:w-48 py-2 text-center text-sm font-medium transition-colors duration-200 rounded-full ${
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/80'
              }`
            }>
            Friends
          </NavLink>

          <NavLink
            to='/friends/requests'
            className={({ isActive }) =>
              `relative z-20 w-32 sm:w-48 py-2 text-center text-sm font-medium transition-colors duration-200 rounded-full ${
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/80'
              }`
            }>
            Requests
          </NavLink>
        </nav>
      </div>

      <div className='friends-content flex-1 overflow-y-auto px-4 pb-4'>
        <Outlet />
      </div>
    </div>
  );
};

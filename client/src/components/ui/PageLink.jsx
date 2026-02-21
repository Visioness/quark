import { NavLink } from 'react-router';

export const PageLink = ({ to, onClick, extra, children }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `p-2 rounded-xl cursor-pointer ${extra ? extra : ''} ${
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'hover:bg-sidebar-accent/50'
        }`
      }>
      {children}
    </NavLink>
  );
};

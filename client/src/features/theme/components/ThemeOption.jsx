export const ThemeOption = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      type='button'
      className='flex justify-center items-center w-9 h-9 cursor-pointer'>
      {children}
    </button>
  );
};

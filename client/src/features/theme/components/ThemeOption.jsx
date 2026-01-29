export const ThemeOption = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      type='button'
      className='flex justify-center items-center w-full h-full cursor-pointer hover:bg-secondary transition-colors'>
      {children}
    </button>
  );
};

import { LoaderPinwheel } from 'lucide-react';

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const LoadingSpinner = ({ size }) => {
  const sizeClass = sizes[size] ?? 'h-full';

  return (
    <div
      className={`loading-spinner animate-spin max-w-full max-h-full ${sizeClass}`}>
      <LoaderPinwheel className='w-full h-full' />
    </div>
  );
};

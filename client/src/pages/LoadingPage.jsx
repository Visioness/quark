import { LoadingSpinner } from '@/components/ui';

export const LoadingPage = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background text-foreground'>
      <LoadingSpinner size='lg' />
    </div>
  );
};

import { AlertCircle } from 'lucide-react';

export const AuthError = ({ error }) => {
  return (
    <div
      className={`error mt-0.5 sm:mt-1 flex items-center gap-1 font-semibold text-[10px]/3 sm:text-[12px]/3 text-rose-400 transition-transform origin-center ${
        error ? 'scale-y-100' : 'scale-y-0'
      }`}>
      {error && (
        <>
          <AlertCircle className='w-3 min-w-3 h-3' />
          <span className='message'>{error}</span>
        </>
      )}
    </div>
  );
};

import { Link, Navigate } from 'react-router';
import { SignUpForm } from '@/features/auth/components';
import { useAuth } from '@/features/auth/context';

export const SignUpPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-background text-foreground'>
      <div className='px-6 py-4 sm:p-8 border rounded-lg shadow-sm bg-card text-card-foreground border-border w-full max-w-xs sm:max-w-md'>
        <h1 className='text-2xl font-bold mb-2 sm:mb-6 text-primary'>
          Create an Account
        </h1>
        <p className='mb-4 text-muted-foreground'>
          Sign up to get started with Quark.
        </p>

        <SignUpForm />

        <div className='mt-4 text-center text-sm'>
          Already have an account?{' '}
          <Link to='/auth/log-in' className='text-primary hover:underline'>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

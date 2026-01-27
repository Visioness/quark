import { LoaderPinwheel } from 'lucide-react';
import { useForm } from '@/features/auth/hooks';
import { Input } from '@/components/ui';

export const SignUpForm = () => {
  const { formData, loading, error, handleChange, onSubmit } = useForm({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const buttonDisabled =
    formData.username === '' ||
    error?.username ||
    formData.email === '' ||
    error?.email ||
    formData.password === '' ||
    error?.password ||
    formData.confirmPassword === '' ||
    error?.confirmPassword;

  return (
    <form id='sign-up' onSubmit={onSubmit} className='space-y-2 sm:space-y-4'>
      <Input
        type='text'
        name='username'
        placeholder='JDoe'
        value={formData.username}
        onChange={handleChange}
        validationError={error?.username}>
        Username
      </Input>
      <Input
        type='email'
        name='email'
        placeholder='johndoe@example.com'
        value={formData.email}
        onChange={handleChange}
        validationError={error?.email}>
        E-Mail
      </Input>
      <Input
        type='password'
        name='password'
        placeholder='••••••••'
        value={formData.password}
        onChange={handleChange}
        validationError={error?.password}>
        Password
      </Input>
      <Input
        type='password'
        name='confirmPassword'
        placeholder='••••••••'
        value={formData.confirmPassword}
        onChange={handleChange}
        validationError={error?.confirmPassword}>
        Confirm Password
      </Input>

      <div
        className={`error mt-0.5 sm:mt-1 flex items-center gap-1 font-semibold text-[10px]/3 sm:text-[12px]/3 text-rose-400 transition-transform origin-center ${
          error?.global ? 'scale-y-100' : 'scale-y-0'
        }`}>
        {error?.global && (
          <>
            <AlertCircle className='w-3 min-w-3 h-3' />
            <span className='message'>{error.global}</span>
          </>
        )}
      </div>

      <button
        disabled={buttonDisabled}
        className='w-full py-2 px-4 flex justify-center items-center bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground disabled:pointer-events-none cursor-pointer'>
        {loading ? <LoaderPinwheel className='animate-spin' /> : 'Sign Up'}
      </button>
    </form>
  );
};

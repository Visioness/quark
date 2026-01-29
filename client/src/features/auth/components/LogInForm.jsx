import { useForm } from '@/features/auth/hooks';
import { AuthError, Input, Button } from '@/components/ui';
import { useAuth } from '@/features/auth/context/AuthContext';

export const LogInForm = () => {
  const { login } = useAuth();
  const { formData, loading, error, handleChange, onSubmit } = useForm({
    initialForm: {
      username: '',
      password: '',
    },
    apiCall: login,
  });

  const buttonDisabled =
    formData.username === '' ||
    error?.username ||
    formData.password === '' ||
    error?.password;

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
        type='password'
        name='password'
        placeholder='••••••••'
        value={formData.password}
        onChange={handleChange}
        validationError={error?.password}>
        Password
      </Input>

      <AuthError error={error?.global} />

      <Button type='submit' loading={loading} disabled={buttonDisabled}>
        Log In
      </Button>
    </form>
  );
};

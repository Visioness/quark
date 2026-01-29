import { useForm } from '@/features/auth/hooks';
import { AuthError, Button, Input } from '@/components/ui';
import { useAuth } from '@/features/auth/context/AuthContext';

export const SignUpForm = () => {
  const { signup } = useAuth();
  const { formData, loading, error, handleChange, onSubmit } = useForm({
    initialForm: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    apiCall: signup,
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

      <AuthError error={error?.global} />

      <Button type='submit' loading={loading} disabled={buttonDisabled}>
        Sign Up
      </Button>
    </form>
  );
};

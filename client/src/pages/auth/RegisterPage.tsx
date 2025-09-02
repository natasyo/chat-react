import { z } from 'zod';
import { Input } from '../../ui/Input.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../ui/Button.tsx';
import { registerUser } from '../../functions/api.ts';
import { AxiosError } from 'axios';

const loginSchema = z
  .object({
    email: z.email({ message: 'Email is required' }),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must match',
        path: ['confirmPassword', 'password'],
      });
    }
  });

type RegisterFormData = z.infer<typeof loginSchema>;

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function RegisterForm(data: RegisterFormData) {
    try {
      await registerUser(
        data.email,
        data.password,
        data.confirmPassword,
      );
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.status === 400
      ) {
        setError('email', {
          type: 'serverError',
          message: 'Email already exists',
        });
      } else {
        console.error(error);
      }
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(RegisterForm)}
        className={`flex flex-col items-center`}
      >
        <Input
          {...register('email')}
          error={errors.email}
          placeholder="Email"
        />
        <Input
          {...register('password')}
          error={errors.password}
          type={'password'}
          placeholder={'Password'}
        />
        <Input
          {...register('confirmPassword')}
          error={errors.password}
          type={'password'}
          placeholder={'Confirm Password'}
        />
        <Button variant={'primary'} type={'submit'}>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;

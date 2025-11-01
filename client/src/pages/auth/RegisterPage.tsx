import { z } from 'zod';
import { Input } from '../../ui/Input.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../ui/Button.tsx';
import { registerUser } from '../../functions/api.ts';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Layout.tsx';

const registerSchema = z
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

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema as any),
  });

  async function RegisterForm(data: RegisterFormData) {
    try {
      await registerUser(
        data.email,
        data.password,
        data.confirmPassword,
      );
      navigate('/auth/login');
    } catch (error) {
      console.log(error);
      if (
        error instanceof AxiosError &&
        error.status === 400
      ) {
        if (error.response?.data.message instanceof Array) {
          error.response?.data.message.map(
            (err: {
              field: string;
              errors: Array<string>;
            }) => {
              console.log(err);
              const field =
                err.field as keyof RegisterFormData;
              let messageErr = '';
              err.errors.map((message) => {
                messageErr += message + ', ';
              });
              console.log(field, messageErr);
              setError(field, {
                message: messageErr,
              });
            },
          );
        } else {
          setError('email', {
            type: 'serverError',
            message: 'Email already exists',
          });
        }
      } else {
        console.error(error);
      }
    }
  }

  return (
    <Layout>
      <h1>Register</h1>
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
          error={errors.confirmPassword}
          type={'password'}
          placeholder={'Confirm Password'}
        />
        <div className="flex justify-center items-center">
          <Button variant={'primary'} type={'submit'}>
            Register
          </Button>
          <a href="/auth/login" className={`mx-5`}>
            Login
          </a>
        </div>
      </form>
    </Layout>
  );
};

export default RegisterPage;

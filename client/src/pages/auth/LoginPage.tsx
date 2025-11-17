import { Input } from '../../ui/Input.tsx';
import { Button } from '../../ui/Button.tsx';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import {
  checkAuth,
  loginUser,
} from '../../functions/api.ts';
import { Layout } from './Layout.tsx';
import { useAuthStore } from '../../store/AuthStore.ts';
import { useEffect } from 'react';

const loginScheme = z.object({
  email: z.string().email('Email is required'),
  password: z.string('password is required'),
});

type LoginFormData = z.infer<typeof loginScheme>;

const LoginPage = () => {
  const { register, handleSubmit } =
    useForm<LoginFormData>();
  const authStore = useAuthStore();
  const loginHandler = async (data: LoginFormData) => {
    try {
      const response = await loginUser(
        data.email,
        data.password,
      );
      if (response.status === 201) {
        const user = await checkAuth();
        console.log(user);
        authStore.setUser(user?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(authStore);
  }, [authStore]);
  return (
    <Layout>
      <h1>login</h1>
      <form onSubmit={handleSubmit(loginHandler)}>
        <Input
          {...register('email')}
          className={`mx-auto`}
        />
        <Input
          {...register('password')}
          className={`mx-auto block`}
          type={'password'}
        />
        <div
          className={`flex justify-center items-center my-5`}
        >
          <Button
            className={`mx-3`}
            variant={'primary'}
            type={'submit'}
          >
            Login
          </Button>
          <a className={`mx-3`} href="/auth/register">
            Register
          </a>
        </div>
      </form>
    </Layout>
  );
};

export default LoginPage;

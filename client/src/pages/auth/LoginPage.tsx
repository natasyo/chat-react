import { Input } from '../../ui/Input.tsx';
import { Button } from '../../ui/Button.tsx';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { loginUser } from '../../functions/api.ts';
import { useAuthStore } from '../../store/AuthStore.tsx';

const loginScheme = z.object({
  email: z.string().email('Email is required'),
  password: z.string('password is required'),
});

type LoginFormData = z.infer<typeof loginScheme>;

const LoginPage = () => {
  const store = useAuthStore();
  const { register, handleSubmit } =
    useForm<LoginFormData>();
  const loginHandler = async (data: LoginFormData) => {
    try {
      const response = await loginUser(
        data.email,
        data.password,
      );
      console.log(response);
      store.login(
        response.data.access_token,
        response.data.email,
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
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
    </div>
  );
};

export default LoginPage;

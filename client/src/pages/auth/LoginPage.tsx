import { useState } from 'react';
import { Input } from '../../ui/Input.tsx';
import { Button } from '../../ui/Button.tsx';

const LoginPage = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<
    string | undefined
  >();
  return (
    <div>
      <h1>login</h1>
      <Input
        value={email}
        placeholder={`Email`}
        onChange={(e) => {
          setEmail((e.target as HTMLInputElement).value);
        }}
        className={`mx-auto`}
      />
      <Input
        value={password}
        placeholder={`Password`}
        onChange={(e) => {
          setPassword((e.target as HTMLInputElement).value);
        }}
        className={`mx-auto block`}
      />
      <div
        className={`flex justify-center items-center my-5`}
      >
        <Button className={`mx-3`} variant={'primary'}>
          Login
        </Button>
        <a className={`mx-3`} href="/auth/register">
          Register
        </a>
      </div>
    </div>
  );
};

export default LoginPage;

import { Layout } from './Layout.tsx';
import { Input } from '../../ui/Input.tsx';
import { Button } from '../../ui/Button.tsx';
import { useAuthStore } from '../../store/AuthStore.ts';
import { getUser } from '../../functions/api.ts';
import { useEffect, useState } from 'react';
import type { UserModelType } from '../../../../shared/generated/zod/schemas';

export const ProfilePage = () => {
  const [user, setUser] = useState<UserModelType | null>(
    null,
  );
  const email = useAuthStore((state) => state.email);
  useEffect(() => {
    (async () => {
      if (!user) return null;
      if (email) {
        const data = await getUser(email);
        setUser(data);
        console.log(user);
      }
    })();
  }, [email]);
  return (
    <Layout>
      <h1>Profile</h1>
      {user && <p>{user.email}</p>}
      <form>
        <Input
          placeholder={`Name`}
          className={'mx-auto'}
          value={user?.name || ''}
          onChange={(e) => {
            setUser((prev) =>
              prev
                ? { ...prev, name: e.target.value }
                : prev,
            );
          }}
        />
        <Input
          placeholder={`Email`}
          type={'email'}
          className={`mx-auto`}
          value={user?.email || ''}
        />
        <Button
          variant={'primary'}
          className={'px-10 mx-auto my-3'}
        >
          Save
        </Button>
      </form>
    </Layout>
  );
};

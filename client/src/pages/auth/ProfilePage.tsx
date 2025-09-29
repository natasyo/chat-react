import { Layout } from './Layout.tsx';
import { Input } from '../../ui/Input.tsx';
import { useAuthStore } from '../../store/AuthStore.ts';
import { useEffect, useState } from 'react';
import type { Profile, User } from '../../types/prisma.ts';
import { getUser } from '../../functions/api.ts';
import { Button } from '../../ui/Button.tsx';

export const ProfilePage = () => {
  const email = useAuthStore((state) => state.email);
  const [user, setUser] = useState<Partial<User> | null>(
    null,
  );
  useEffect(() => {
    if (email) {
      (async () => {
        const data = (await getUser(email)).data as User;
        setUser(data);
      })();
    }
  }, [email]);
  return (
    <Layout>
      <h2 className={`text-center`}>Profile {email}</h2>
      <Input
        className={'mx-auto'}
        value={user?.profile?.name ?? ''}
        placeholder={`Name`}
        onChange={(e) => {
          setUser((prev) => ({
            ...(prev ?? {}),
            profile: {
              ...((prev && prev.profile) ??
                ({} as Profile)),
              name: (e.target as HTMLInputElement).value,
            },
          }));
        }}
      />
      <Input
        className={'mx-auto'}
        value={user?.profile?.surname ?? ''}
        placeholder={`Surname`}
        onChange={(e) => {
          setUser((prev) => ({
            ...(prev ?? {}),
            profile: {
              ...((prev && prev.profile) ??
                ({} as Profile)),
              surname: (e.target as HTMLInputElement).value,
            },
          }));
        }}
      />
      <Button
        className={`mx-auto px-6 py-2`}
        variant={'primary'}
        onClick={(e) => {
          e.preventDefault();
          (async () => {
            // if (user && user.id)
            //   await updateProfile(user.id, user);
          })();

          console.log(user);
        }}
      >
        Save
      </Button>
    </Layout>
  );
};

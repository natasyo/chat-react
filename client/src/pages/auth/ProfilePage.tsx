import { Layout } from './Layout.tsx';
import { Input } from '../../ui/Input.tsx';
import { useAuthStore } from '../../store/AuthStore.ts';
import { useEffect, useState } from 'react';
import type { Profile, User } from '@chat/shared';
import {
  getUser,
  updateProfile,
} from '../../functions/api.ts';
import { Button } from '../../ui/Button.tsx';
import { FileInput } from '../../ui/FileInput.tsx';

export const ProfilePage = () => {
  const email = useAuthStore((state) => state.email);
  const [user, setUser] = useState<User | null>(null);
  const [file, setFile] = useState<File>();
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
            ...prev!,
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
            ...prev!,
            profile: {
              ...((prev && prev.profile) ??
                ({} as Profile)),
              surname: (e.target as HTMLInputElement).value,
            },
          }));
        }}
      />
      <FileInput
        image={`${user?.profile?.photo ?? undefined}`}
        className={`mx-auto`}
        onChange={(event) => {
          const fileName = (
            event.target as HTMLInputElement
          ).files?.[0].name;
          setFile(
            (event.target as HTMLInputElement).files?.[0],
          );
          setUser((prev) => ({
            ...prev!,
            profile: {
              ...((prev && prev.profile) ??
                ({} as Profile)),
              photo: fileName ?? '',
            },
          }));
          console.log(
            (event.target as HTMLInputElement).value,
          );
        }}
      />
      <Button
        className={`mx-auto px-6 py-2`}
        variant={'primary'}
        onClick={(e) => {
          e.preventDefault();
          (async () => {
            if (user?.profile)
              await updateProfile(
                user.id,
                user.profile,
                file,
              );
          })();

          console.log(user);
        }}
      >
        Save
      </Button>
    </Layout>
  );
};

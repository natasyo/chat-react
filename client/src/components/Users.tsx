import { useEffect, useState } from 'react';
import type { User } from '../types/prisma.ts';
import { getUsers } from '../functions/api.ts';
import { useChatStore } from '../store/ChatsStore.ts';
import { IMAGE_URL } from '../../config.ts';

export const Users = () => {
  const [users, setUsers] = useState<User[]>();
  useEffect(() => {
    (async () => {
      const usersData = await getUsers();
      setUsers(usersData.data as User[]);
    })();
  }, []);
  const chatStore = useChatStore();
  return (
    <div>
      {users?.map((user) => (
        <p
          onClick={() => {
            chatStore.addUser(user);
            chatStore.changeActiveRecipient(user);
          }}
          key={user.id}
          className={`flex items-center py-2 px-1 hover:bg-light-panel-stroke hover:dark:text-dark-panel-stroke`}
        >
          <img
            src={`${IMAGE_URL}/${user.profile?.photo}`}
            alt={`${user.profile?.name} photo`}
            className="w-10 me-3"
          />
          {user.profile?.name} {user.profile?.surname}
        </p>
      ))}
    </div>
  );
};

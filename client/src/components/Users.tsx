import { useEffect, useState } from 'react';
import type { User } from '../types/prisma.ts';
import { getUsers } from '../functions/api.ts';

export const Users = () => {
  const [users, setUsers] = useState<User[]>();
  useEffect(() => {
    (async () => {
      const usersData = await getUsers();
      setUsers(usersData.data as User[]);
    })();
  }, []);

  return (
    <div>
      {users?.map((user) => (
        <p
          key={user.id}
          className={`flex items-center py-2 px-1 hover:bg-light-panel-stroke hover:dark:text-dark-panel-stroke`}
        >
          <img
            src={`http://localhost:3000/uploads/${user.profile?.photo}`}
            alt={`${user.profile?.name} photo`}
            className="w-10 me-3"
          />
          {user.profile?.name} {user.profile?.surname}
        </p>
      ))}
    </div>
  );
};

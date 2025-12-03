import { useChatStore } from '../store/ChatsStore.ts';
import { IMAGE_URL } from '../../config.ts';
import { useUsers } from '../store/UsersStore.ts';

export const Users = () => {
  const usersData = useUsers();
  const chatStore = useChatStore();
  return (
    <div>
      {usersData.users.map((user) => (
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
          <span
            className={`ms-2 rounded-full h-7 w-7 flex items-center justify-center text-white text-sm font-bold bg-green-600 `}
          >
            {user.countNewMessages}
          </span>
        </p>
      ))}
    </div>
  );
};

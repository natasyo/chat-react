import { Button } from '../../ui/Button.tsx';
import { useAuthStore } from '../../store/AuthStore.ts';
import { Link } from 'react-router-dom';

type Props = {
  className?: string;
  isShow?: boolean;
};
export const MessengerMenu = ({
  className,
  isShow,
}: Props) => {
  const authStore = useAuthStore();
  return (
    <div
      className={`${isShow ? '' : 'hidden'}  w-[250px] px-5 pt-18  rounded-2xl bg-light-muted dark:bg-dark-muted   flex flex-col items-end ${className ? className : ''} `}
    >
      <Link to={'/profile'} className={`block my-3 w-full`}>
        Profile
      </Link>
      <Button
        variant={`primary`}
        onClick={() => authStore.deleteUser()}
      >
        Logout
      </Button>
    </div>
  );
};

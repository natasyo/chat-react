import { Button } from '../../ui/Button.tsx';
import { useAuthStore } from '../../store/AuthStore.ts';

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
      className={`${isShow ? '' : 'hidden'}  w-[250px] pe-5 pt-18  rounded-2xl bg-light-muted dark:bg-dark-muted   flex flex-col items-end ${className ? className : ''} `}
    >
      <Button
        variant={`primary`}
        onClick={() => authStore.logout()}
      >
        Logout
      </Button>
    </div>
  );
};

import { Button } from '../../ui/Button.tsx';
import { MessengerMenu } from './MessengerMenu.tsx';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { useThemeStore } from '../../store/ThemeStore.ts';
import { useAuthStore } from '../../store/AuthStore.ts';

const MessengerHeader = () => {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const { toggleTheme } = useThemeStore();
  const authStore = useAuthStore();
  return (
    <div
      className={`relative z-20 flex justify-between pt-3 pb-5 px-6 border border-light-panel-stroke/40 dark:border-dark-panel-stroke/40 border-opacity-40 rounded-2xl`}
    >
      <div className="flex items-center">
        {/*<img*/}
        {/*  src={`${IMAGE_URL}/${user?.profile?.photo}`}*/}
        {/*  alt={`${user?.profile?.name}`}*/}
        {/*  className={`h-18 me-5`}*/}
        {/*/>*/}
        <div className="">
          <p
            className={`font-bold text-2xl text-shadow-lg`}
          >
            {authStore.user?.email}
          </p>
          {/*<p className={'text-sm'}>*/}
          {/*  {authStore.user!.email}*/}
          {/*</p>*/}
        </div>
      </div>

      <div className="flex items-center">
        <Button
          onClick={toggleTheme}
          variant={'outline'}
          className={`w-8 h-8 me-3`}
        >
          <FontAwesomeIcon icon={faLightbulb} />
        </Button>
        <div
          onMouseEnter={() => setIsShowMenu(true)}
          onMouseLeave={() => setIsShowMenu(false)}
        >
          <Button
            variant={`outline`}
            className={`h-8 w-8 relative z-20`}
          >
            ⋮
          </Button>
          <MessengerMenu
            isShow={isShowMenu}
            className={`absolute right-0 top-0`}
          />
        </div>
      </div>
    </div>
  );
};

export default MessengerHeader;

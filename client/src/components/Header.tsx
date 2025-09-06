import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from '../store/ThemeStore.ts';
import { useAuthStore } from '../store/AuthStore.tsx';
import { Button } from '../ui/Button.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  const store = useAuthStore();
  useEffect(() => {
    console.log(store);
  }, [store]);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  return (
    <header
      className={`bg-blue-200 dark:bg-blue-950 dark:text-white `}
    >
      <div className="flex justify-between container  mx-auto py-2 items-center">
        <Link to={'/'}>
          <h2>Chat</h2>
        </Link>
        <div className={`flex items-center`}>
          {store.jwt ? (
            <div className={`fex items-center`}>
              <Link to={'/profile'}>Profile</Link>
              <Button onClick={() => store.logout()}>
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to={'/auth/login'}>Login</Link>
            </>
          )}
          <button className={`p-3`} onClick={toggleTheme}>
            <FontAwesomeIcon icon={faLightbulb} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

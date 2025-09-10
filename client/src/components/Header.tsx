import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/ThemeStore.ts';
import { useAuthStore } from '../store/AuthStore.ts';
import { Button } from '../ui/Button.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
const Header = () => {
  const { toggleTheme } = useThemeStore();
  const store = useAuthStore();

  return (
    <header
      className={`bg-light-panel dark:bg-dark-panel dark:text-white 
      mb-4 me-6 p-3`}
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

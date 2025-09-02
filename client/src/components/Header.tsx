import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from '../store/ThemeStore.ts';

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
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
      <div className="flex justify-between container  mx-auto py-2">
        <Link to={'/'}>
          <h2>Chat</h2>
        </Link>
        <div>
          <Link to={'/auth/login'}>Login</Link>
          <button className={`p-3`} onClick={toggleTheme}>
            th
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

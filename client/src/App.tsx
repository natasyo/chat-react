import './App.css';
import MessengerPage from './pages/Messanger/MessengerPage.tsx';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import PrivateRoute from './routes/privateRoute.tsx';
import GuestRoute from './routes/guestRoute.tsx';
import { ProfilePage } from './pages/auth/ProfilePage.tsx';
import { useThemeStore } from './store/ThemeStore.ts';
import { useEffect } from 'react';

function App() {
  const theme = useThemeStore((store) => store.theme);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MessengerPage />} />
            <Route
              path="/profile"
              element={<ProfilePage />}
            />
          </Route>
          <Route element={<GuestRoute />}>
            <Route
              path="/auth/login"
              element={<LoginPage />}
            />
            <Route
              path="/auth/register"
              element={<RegisterPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

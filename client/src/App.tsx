import './App.css';
import MessagesPage from './pages/MessagesPage.tsx';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import Layout from './Layout.tsx';
import LoginPage from './pages/auth/LoginPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import PrivateRoute from './routes/privateRoute.tsx';
import GuestRoute from './routes/guestRoute.tsx';
import { ProfilePage } from './pages/auth/ProfilePage.tsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<MessagesPage />} />
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
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;

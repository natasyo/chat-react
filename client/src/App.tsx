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

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<MessagesPage />} />
            <Route
              path="/auth/login"
              element={<LoginPage />}
            />
            <Route
              path="/auth/register"
              element={<RegisterPage />}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;

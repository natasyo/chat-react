import { useAuthStore } from '../store/AuthStore.ts';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const authStore = useAuthStore();
  return (
    <div>
      {authStore.jwt ? (
        <Outlet />
      ) : (
        <Navigate to={'/auth/login'} />
      )}
    </div>
  );
};

export default PrivateRoute;

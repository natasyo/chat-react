import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore.ts';

const PrivateRoute = () => {
  const authStore = useAuthStore();
  return (
    <div>
      {authStore.user && authStore.user.email ? (
        <Outlet />
      ) : (
        <Navigate to={'/auth/login'} />
      )}
    </div>
  );
};

export default PrivateRoute;

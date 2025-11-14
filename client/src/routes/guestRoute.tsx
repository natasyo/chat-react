import { useAuthStore } from '../store/AuthStore.ts';
import { Navigate, Outlet } from 'react-router-dom';

const GuestRoute = () => {
  const store = useAuthStore();
  return (
    <div>
      {!store.user ? <Outlet /> : <Navigate to={`/`} />}
    </div>
  );
};

export default GuestRoute;
